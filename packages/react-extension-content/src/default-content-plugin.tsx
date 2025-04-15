import { ContentExtensionBuilder } from '@/content-extension-builder';
import { ErrorBoundary } from '@/ui/error-boundary';
import {
  ContentItem,
  ContentPlugin,
  ContentProvider,
  ExtensionBuilder,
  type ItemType,
  LayoutConfiguration,
  SchemaItem,
  TypeDescriptor,
  useVyuhStore,
} from '@vyuh/react-core';
import React from 'react';

/**
 * Default implementation of ContentPlugin.
 */
export class DefaultContentPlugin extends ContentPlugin {
  private extensionBuilder?: ContentExtensionBuilder;
  constructor() {
    super('vyuh.plugin.content.default', 'Default Content Plugin', {});
  }

  getItem<T extends SchemaItem>(
    itemType: ItemType<T>,
    schemaType: string,
  ): TypeDescriptor<T> | undefined {
    return this.extensionBuilder?.getItem(itemType, schemaType);
  }

  registerItem<T extends SchemaItem>(
    itemType: ItemType<T>,
    descriptor: TypeDescriptor<T>,
  ): void {
    this.extensionBuilder?.registerItem(itemType, descriptor);
  }

  /**
   * Build content from a JSON object
   */
  render(
    json: Record<string, any> | ContentItem,
    options?: { layout: LayoutConfiguration },
  ): React.ReactNode {
    console.log(json);
    const schemaType = json.schemaType ?? 'ContentBuilder';
    console.log('>@@@@');
    console.log(json);
    // Wrap the renderer in an error boundary to isolate rendering errors
    return (
      <ErrorBoundary title={`Failed to render: ${schemaType}`}>
        <ContentRenderer
          schemaType={schemaType}
          extensionBuilder={this.extensionBuilder}
          content={json as ContentItem}
          layout={options?.layout}
        />
      </ErrorBoundary>
    );
  }

  /**
   * Attach an extension builder to this plugin
   */
  attach(extBuilder: ExtensionBuilder): void {
    // Using getState() here since this is not inside a React component's render function
    const telemetry = useVyuhStore.getState().plugins.telemetry;

    if (!(extBuilder instanceof ContentExtensionBuilder)) {
      telemetry?.log(
        `For the ${this.constructor.name} to work, there must be one ContentExtensionBuilder in your extension builders. However, you have provided a ${extBuilder.constructor.name}`,
        'warning',
      );
      return;
    }

    this.extensionBuilder = extBuilder as ContentExtensionBuilder;
  }

  async dispose(): Promise<void> {
    // Dispose the content provider
    // return this.provider.dispose();
  }

  async init(): Promise<void> {
    // Initialize the content provider
    // return this.provider.init();
  }
}

/**
 * Component that handles the actual rendering of content in its own render phase
 */
function ContentRenderer({
  schemaType,
  content,
  extensionBuilder,
  layout,
}: {
  schemaType: string;
  content: ContentItem;
  extensionBuilder?: ContentExtensionBuilder;
  layout?: LayoutConfiguration | undefined;
}) {
  const builder = extensionBuilder?.getBuilder(schemaType);
  return builder?.render(content, layout);
}
