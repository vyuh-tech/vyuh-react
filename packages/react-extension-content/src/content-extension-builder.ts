import { ContentBuilder } from '@/content-builder';
import { ContentDescriptor } from '@/content-descriptor';
import { ContentExtensionDescriptor } from '@/content-extension-descriptor';
import {
  ActionConfiguration,
  ConditionConfiguration,
  ContentModifierConfiguration,
  ExtensionBuilder,
  ExtensionDescriptor,
  ItemType,
  LayoutConfiguration,
  SchemaItem,
  TypeDescriptor,
  useVyuhStore,
} from '@vyuh/react-core';

/**
 * Builder for content extensions
 */
export class ContentExtensionBuilder extends ExtensionBuilder {
  private typeMap = new Map<ItemType<any>, Map<string, any>>();

  constructor() {
    super({ type: ContentExtensionDescriptor.extensionType });
  }

  /**
   * Build the content extension
   */
  build(descriptors: ExtensionDescriptor[]): void {
    const extensionDescriptors = descriptors as ContentExtensionDescriptor[];
    const store = useVyuhStore.getState();
    const telemetry = store.plugins.telemetry;

    // First attach to the content plugin
    this.findAndAttachToContentPlugin();

    // Initialize type maps for each item type
    this.initTypeMap(ContentBuilder);
    this.initTypeMap(ContentModifierConfiguration);
    this.initTypeMap(ActionConfiguration);
    this.initTypeMap(ConditionConfiguration);
    this.initTypeMap(LayoutConfiguration);

    // Collect all content builders
    this.collectItems<ContentBuilder>(
      extensionDescriptors,
      (descriptor) => descriptor.contentBuilders || [],
      ContentBuilder,
      'ContentBuilder',
    );

    // Collect all default layouts for builders
    this.collectItems(
      extensionDescriptors,
      (descriptor) =>
        (descriptor.contentBuilders || []).flatMap((builder) => [
          builder.defaultLayoutDescriptor,
        ]),
      LayoutConfiguration,
      'Default Layouts',
    );

    // Collect all content modifiers
    this.collectItems(
      extensionDescriptors,
      (descriptor) => descriptor.contentModifiers || [],
      ContentModifierConfiguration,
      'ContentModifier',
    );

    // Collect all actions
    this.collectItems(
      extensionDescriptors,
      (descriptor) => descriptor.actions || [],
      ActionConfiguration,
      'Action',
    );

    // Collect all conditions
    this.collectItems(
      extensionDescriptors,
      (descriptor) => descriptor.conditions || [],
      ConditionConfiguration,
      'Condition',
    );

    // Collect all layouts
    this.collectItems(
      extensionDescriptors,
      (descriptor) =>
        (descriptor.contents || []).flatMap((layout) => layout.layouts || []),
      LayoutConfiguration,
      'Layout',
    );

    // Group content descriptors by schema type
    const contentDescriptorsByType = extensionDescriptors
      .flatMap((descriptor) => descriptor.contents || [])
      .reduce((map, descriptor) => {
        const list = map.get(descriptor.schemaType) || [];
        list.push(descriptor);
        map.set(descriptor.schemaType, list);
        return map;
      }, new Map<string, ContentDescriptor[]>());

    // Validate that every ContentDescriptor has a ContentBuilder
    for (const [
      schemaType,
      descriptors,
    ] of contentDescriptorsByType.entries()) {
      if (!this.getBuilder(schemaType)) {
        telemetry?.reportError(
          new Error(
            `Missing ContentBuilder for ContentDescriptor of schemaType: ${schemaType}`,
          ),
          { params: { descriptors: descriptors.length } },
        );
      }
    }

    // Initialize content builders with their descriptors
    const contentBuilderMap = this.typeMap.get(ContentBuilder) || new Map();
    for (const [schemaType, builder] of contentBuilderMap.entries()) {
      const descriptors = contentDescriptorsByType.get(schemaType) || [];
      builder.init(descriptors);
    }
  }

  registerItem<T extends SchemaItem>(
    itemType: ItemType<T>,
    descriptor: TypeDescriptor<T>,
  ): void {
    if (!this.typeMap.has(itemType)) {
      this.typeMap.set(itemType, new Map());
    }

    const { telemetry } = useVyuhStore.getState().plugins;
    const itemMap = this.typeMap.get(itemType)!;

    if (itemMap.has(descriptor.schemaType)) {
      telemetry?.log(
        `Duplicate schemaType: ${descriptor.schemaType} is being registered.`,
        'warning',
      );
    }

    itemMap.set(descriptor.schemaType, descriptor);
  }

  /**
   * Get a content builder by schema type
   */
  getBuilder(schemaType: string): ContentBuilder | undefined {
    const contentBuilderMap = this.typeMap.get(ContentBuilder);

    const builder = contentBuilderMap?.get(schemaType);

    if (!builder) {
      throw new Error(
        `
No ContentBuilder found with schemaType: ${schemaType}.
Make sure you have registered a ContentBuilder for this schema type.
`,
      );
    }

    return builder;
  }

  /**
   * Get an item by its schema type
   */
  getItem<T extends SchemaItem>(
    itemType: ItemType<T>,
    schemaType: string | undefined,
  ): TypeDescriptor<T> | undefined {
    if (!schemaType) {
      return undefined;
    }

    const itemMap = this.typeMap.get(itemType);
    const item = itemMap?.get(schemaType);

    if (!item) {
      throw new Error(
        `
No Item found with schemaType: ${schemaType}.
Make sure you have registered a TypeDescriptor<${itemType.name}> for this schema type.
      `.trim(),
      );
    }

    return itemMap!.get(schemaType);
  }

  /**
   * Find the content plugin from the Vyuh store and attach to it
   */
  private findAndAttachToContentPlugin(): void {
    const store = useVyuhStore.getState();
    const telemetry = store.plugins.telemetry;

    if (!store) {
      telemetry?.reportError(
        new Error(
          'Vyuh store not found, cannot attach ContentExtensionBuilder to ContentPlugin',
        ),
      );
      return;
    }

    const plugins = store.plugins;
    if (!plugins) {
      telemetry?.reportError(new Error('No plugins found in Vyuh store'));
      return;
    }

    // Find the content plugin
    const contentPlugin = plugins.content;
    if (!contentPlugin) {
      telemetry?.reportError(
        new Error('ContentPlugin not found in Vyuh store'),
      );
      return;
    }

    // Simply attach this extension builder to the plugin
    contentPlugin.attach(this);
  }

  /**
   * Collect items of a specific type from extension descriptors
   */
  private collectItems<T extends SchemaItem>(
    descriptors: ContentExtensionDescriptor[],
    extractor: (descriptor: ContentExtensionDescriptor) => T[],
    itemType: ItemType<any>,
    itemTypeName: string,
  ): void {
    const telemetry = useVyuhStore.getState().plugins.telemetry;
    const itemMap = this.typeMap.get(itemType) || new Map<string, T>();

    descriptors.flatMap(extractor).forEach((item) => {
      const schemaType = item.schemaType;
      if (!schemaType) {
        telemetry?.log(
          `${itemTypeName} without schema type found and will be ignored`,
          'warning',
        );
        return;
      }

      if (itemMap.has(schemaType)) {
        telemetry?.log(
          `Duplicate ${itemTypeName} for schema type: ${schemaType}. The later definition will override the earlier one.`,
          'warning',
        );
      }
      itemMap.set(schemaType, item);
    });

    this.typeMap.set(itemType, itemMap);
  }

  /**
   * Initialize a type map for a specific item type
   */
  private initTypeMap<T>(itemType: ItemType<T>): void {
    if (!this.typeMap.has(itemType)) {
      this.typeMap.set(itemType, new Map<string, T>());
    }
  }
}
