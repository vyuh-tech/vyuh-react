import { Plugin } from '@/core/plugin';
import { AuthPlugin } from '@/plugins/auth/auth-plugin';
import { DefaultAuthPlugin } from '@/plugins/auth/default-auth-plugin';
import { ContentPlugin } from '@/plugins/content/content-plugin';
import { NoOpContentPlugin } from '@/plugins/content/noop-content-plugin';
import { DefaultEventPlugin } from '@/plugins/event/default-event-plugin';
import { EventPlugin } from '@/plugins/event/event-plugin';
import { NavigationPlugin } from '@/plugins/navigation/navigation-plugin';
import { NoOpNavigationPlugin } from '@/plugins/navigation/noop-navigation-plugin';
import { DefaultTelemetryPlugin } from '@/plugins/telemetry/default-telemetry-plugin';
import { TelemetryPlugin } from '@/plugins/telemetry/telemetry-plugin';

/**
 * Plugin descriptor for Vyuh platform
 */
export class PluginDescriptor {
  readonly content: ContentPlugin;
  readonly telemetry: TelemetryPlugin;
  readonly event: EventPlugin;
  readonly navigation: NavigationPlugin;
  readonly auth: AuthPlugin;

  constructor(props: Partial<PluginDescriptor> = {}) {
    this.content = props.content ?? PluginDescriptor.system.content;
    this.telemetry = props.telemetry ?? PluginDescriptor.system.telemetry;
    this.event = props.event ?? PluginDescriptor.system.event;
    this.navigation = props.navigation ?? PluginDescriptor.system.navigation;
    this.auth = props.auth ?? PluginDescriptor.system.auth;
  }

  /**
   * Get all plugins as an array
   */
  get plugins(): Plugin[] {
    return [
      this.content,
      this.telemetry,
      this.event,
      this.navigation,
      this.auth,
    ];
  }

  /**
   * System default plugins
   */
  static readonly system = new PluginDescriptor({
    content: new NoOpContentPlugin(),
    telemetry: new DefaultTelemetryPlugin(),
    event: new DefaultEventPlugin(),
    navigation: new NoOpNavigationPlugin(),
    auth: new DefaultAuthPlugin(),
  });
}
