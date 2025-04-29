import { ExtensionBuilder } from '@/core/extension-builder';
import { ExtensionDescriptor } from '@/core/extension-descriptor';
import { FeatureDescriptor } from '@/core/feature-descriptor';
import { PlatformComponentBuilder } from '@/core/platform-component-builder';
import { InitState } from '@/core/platform-types';
import { PluginDescriptor } from '@/core/plugin-descriptor';
import { useVyuhStore } from '@/hooks/use-vyuh';
import { SystemReadyEventType } from '@/plugins/event/default-event-plugin';
import { VyuhEvent } from '@/plugins/event/event-plugin';

/**
 * Bootstrap options for the Vyuh platform
 */
interface BootstrapOptions {
  /**
   * Plugin descriptor containing all plugins to be loaded
   */
  plugins?: Partial<PluginDescriptor>;

  /**
   * Function that returns a list of features or a promise that resolves to a list of features
   */
  features: () => FeatureDescriptor[] | Promise<FeatureDescriptor[]>;

  /**
   * Platform component builder
   */
  components?: PlatformComponentBuilder;

  /**
   * Optional initial location for the router
   */
  initialLocation?: string;
}

/**
 * Bootstrap the Vyuh platform
 * This is the entry point for initializing the platform
 */
export async function bootstrap({
  plugins,
  features,
  components,
}: BootstrapOptions): Promise<void> {
  const store = useVyuhStore.getState();

  // Ensure we have a complete plugin descriptor with defaults
  const pluginDescriptor = ensureCompletePluginDescriptor(plugins);

  store.init({
    plugins: pluginDescriptor,
    components: components ?? PlatformComponentBuilder.system,
  });
  store.setInitState(InitState.plugins);

  try {
    // Initialize plugins
    await initPlugins(pluginDescriptor);

    // Initialize features
    store.setInitState(InitState.features);
    await initFeatures(features, pluginDescriptor);

    // Set ready state
    store.setInitState(InitState.ready);

    // Dispatch system ready event
    store.plugins.event.emit(new VyuhEvent(SystemReadyEventType));
  } catch (error) {
    store.setInitState(InitState.error);
    store.setError(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

/**
 * Ensure we have a complete plugin descriptor with all required plugins
 */
function ensureCompletePluginDescriptor(
  plugins?: Partial<PluginDescriptor>,
): PluginDescriptor {
  // If no plugins provided, use system defaults
  if (!plugins) {
    return PluginDescriptor.system;
  }

  return new PluginDescriptor(plugins);
}

/**
 * Initialize all plugins
 */
async function initPlugins(plugins: PluginDescriptor): Promise<void> {
  const telemetry = plugins.telemetry;

  // First dispose any existing plugins
  await Promise.all(plugins.plugins.map((plugin) => plugin.dispose()));

  // Then validate plugin names are unique
  const pluginNames = new Set<string>();
  for (const plugin of plugins.plugins) {
    if (pluginNames.has(plugin.name)) {
      const error = new Error(`Plugin name "${plugin.name}" is not unique`);
      telemetry.reportError(error, {
        params: { plugin: plugin.name },
        fatal: true,
      });
      throw error;
    }
    pluginNames.add(plugin.name);
  }

  // First initialize preloaded plugins
  const preloadedPlugins = plugins.plugins.filter(
    (plugin) => plugin.isPreloaded,
  );
  for (const plugin of preloadedPlugins) {
    const pluginTrace = await telemetry.startTrace(
      `Plugin: ${plugin.name}`,
      'Init',
    );
    try {
      await plugin.init();
      telemetry.log(`Plugin initialized: ${plugin.name}`, 'info');
    } catch (error) {
      const finalError =
        error instanceof Error ? error : new Error(String(error));

      telemetry.reportError(finalError, {
        params: { plugin: plugin.name },
        fatal: false,
      });
      throw error;
    } finally {
      await pluginTrace.stop();
    }
  }

  // Then initialize non-preloaded plugins
  const regularPlugins = plugins.plugins.filter(
    (plugin) => !plugin.isPreloaded,
  );
  for (const plugin of regularPlugins) {
    const pluginTrace = await telemetry.startTrace(
      `Plugin: ${plugin.name}`,
      'Init',
    );
    try {
      await plugin.init();
      telemetry.log(`Plugin initialized: ${plugin.name}`, 'info');
    } catch (error) {
      const finalError =
        error instanceof Error ? error : new Error(String(error));

      await telemetry.reportError(finalError, {
        params: { plugin: plugin.name },
        fatal: false,
      });
      throw error;
    } finally {
      await pluginTrace.stop();
    }
  }
}

/**
 * Initialize features and their extensions
 */
async function initFeatures(
  featuresBuilder: () => FeatureDescriptor[] | Promise<FeatureDescriptor[]>,
  plugins: PluginDescriptor,
): Promise<void> {
  const store = useVyuhStore.getState();
  const telemetry = store.plugins.telemetry;

  // First dispose any existing features
  const existingFeatures = store.features;
  if (existingFeatures.length > 0) {
    const disposeTrace = await telemetry.startTrace('Features', 'Dispose');
    try {
      await disposeFeatures(existingFeatures);
    } finally {
      await disposeTrace.stop();
    }
  }

  // Load features
  const featuresLoadTrace = await telemetry.startTrace('Features', 'Load');
  let features: FeatureDescriptor[] = [];

  try {
    features = await loadFeatures(featuresBuilder);
    store.setFeatures(features);
  } finally {
    await featuresLoadTrace.stop();
  }

  // Initialize each feature
  const featureInitTrace = await telemetry.startTrace(
    'Feature Initialization',
    'Init',
  );
  try {
    await initFeatureInstances(features);
  } finally {
    await featureInitTrace.stop();
  }

  // Initialize feature extensions
  const extensionsTrace = await telemetry.startTrace(
    'Feature Extensions',
    'Init',
  );
  try {
    await initFeatureExtensions(features);
  } finally {
    await extensionsTrace.stop();
  }
}

/**
 * Load all features
 */
async function loadFeatures(
  featuresBuilder: () => FeatureDescriptor[] | Promise<FeatureDescriptor[]>,
): Promise<FeatureDescriptor[]> {
  const store = useVyuhStore.getState();
  const telemetry = store.plugins.telemetry;

  try {
    const features = await featuresBuilder();

    // Validate feature names are unique
    const featureNames = new Set<string>();
    for (const feature of features) {
      if (featureNames.has(feature.name)) {
        throw new Error(`Feature name "${feature.name}" is not unique`);
      }
      featureNames.add(feature.name);
    }

    // Log loaded features
    telemetry.log(`Loaded ${features.length} features`, 'info', {
      featureNames: features.map((f) => f.name).join(', '),
    });

    return features;
  } catch (error) {
    const finalError =
      error instanceof Error ? error : new Error(String(error));

    telemetry.reportError(finalError, {
      params: { context: 'loadFeatures' },
      fatal: true,
    });
    throw error;
  }
}

/**
 * Initialize feature extensions
 */
async function initFeatureExtensions(
  features: FeatureDescriptor[],
): Promise<void> {
  const store = useVyuhStore.getState();
  const telemetry = store.plugins.telemetry;

  // Get all extension builders from features
  const extensionBuilders = features.flatMap(
    (feature) => feature.extensionBuilders || [],
  );

  // Get all extension descriptors from features
  const extensionDescriptors = features.flatMap(
    (feature) => feature.extensions || [],
  );

  // Group extension builders by type and validate uniqueness
  const buildersByType: Record<string, ExtensionBuilder> = {};
  for (const builder of extensionBuilders) {
    const type = builder.type;

    // Check if we already have a builder for this type
    if (buildersByType[type]) {
      const error = new Error(
        `Multiple extension builders found for type: ${type}. There can only be one builder per extension type.`,
      );
      telemetry.reportError(error, {
        params: { extensionType: type },
        fatal: true,
      });
      throw error;
    }

    buildersByType[type] = builder;
  }

  // Group extension descriptors by type
  const descriptorsByType = extensionDescriptors.reduce(
    (acc, descriptor) => {
      const type = descriptor.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(descriptor);
      return acc;
    },
    {} as Record<string, ExtensionDescriptor[]>,
  );

  // Process each extension type
  for (const type in descriptorsByType) {
    const typeTrace = await telemetry.startTrace(`${type} Extensions`, 'Init');
    try {
      const descriptors = descriptorsByType[type];
      const builder = buildersByType[type];

      // Throw an error if no builder exists for this extension type
      if (!builder) {
        const error = new Error(
          `Missing ExtensionBuilder for ExtensionDescriptor of type: ${type}`,
        );
        telemetry.reportError(error, {
          params: { extensionType: type },
          fatal: true,
        });
        throw error;
      }

      // Build extensions with the appropriate descriptors
      builder.build(descriptors);
    } finally {
      await typeTrace.stop();
    }
  }
}

/**
 * Dispose all features by calling their dispose methods
 */
async function disposeFeatures(features: FeatureDescriptor[]): Promise<void> {
  const store = useVyuhStore.getState();
  const telemetry = store.plugins.telemetry;

  const disposePromises = features
    .filter((feature) => feature.dispose)
    .map(async (feature) => {
      const featureTrace = await telemetry.startTrace(
        `Feature: ${feature.title || feature.name}`,
        'Dispose',
      );
      try {
        await feature.dispose?.();
        telemetry.log(`Feature disposed: ${feature.name}`, 'info');
      } catch (error) {
        const finalError =
          error instanceof Error ? error : new Error(String(error));
        telemetry.reportError(finalError, {
          params: { feature: feature.name },
          fatal: false,
        });
        // Don't rethrow here to ensure all features get a chance to dispose
      } finally {
        await featureTrace.stop();
      }
    });

  await Promise.all(disposePromises);
}

/**
 * Initialize each feature instance by calling its init method
 */
async function initFeatureInstances(
  features: FeatureDescriptor[],
): Promise<void> {
  const store = useVyuhStore.getState();
  const telemetry = store.plugins.telemetry;

  const initPromises = features.map(async (feature) => {
    if (feature.init) {
      const featureTrace = await telemetry.startTrace(
        `Feature: ${feature.title || feature.name}`,
        'Init',
      );
      try {
        await feature.init();
        telemetry.log(`Feature initialized: ${feature.name}`, 'info');
      } catch (error) {
        const finalError =
          error instanceof Error ? error : new Error(String(error));
        telemetry.reportError(finalError, {
          params: { feature: feature.name },
          fatal: false,
        });
        throw finalError;
      } finally {
        await featureTrace.stop();
      }
    }
  });

  await Promise.all(initPromises);
}
