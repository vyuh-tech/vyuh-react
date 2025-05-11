import { SanityLiveContentProvider } from '@/sanity-live-content-provider';
import { makeRouteQuery, SanityConfig } from '@/utils';
import { getFile, getImage } from '@sanity/asset-utils';
import {
  createSanityInstance,
  resolveQuery,
  SanityInstance,
} from '@sanity/sdk';
import {
  ContentProvider,
  FieldKey,
  FileReference,
  ImageReference,
  LiveContentProvider,
  RouteBase,
} from '@vyuh/react-core';

const fieldKeyMap: Record<FieldKey, string> = {
  [FieldKey.type]: '_type',
  [FieldKey.id]: '_id',
  [FieldKey.ref]: '_ref',
  [FieldKey.key]: '_key',
};

export class SanityContentProvider extends ContentProvider {
  private readonly config: SanityConfig;
  private readonly sanityInstance: SanityInstance;

  private readonly _live: SanityLiveContentProvider;

  constructor(config: SanityConfig) {
    // Default 5 minutes
    super({
      name: 'vyuh.plugin.content.provider.sanity',
      title: 'Sanity Content Provider',
    });

    this.config = config;
    this.sanityInstance = createSanityInstance({
      projectId: config.projectId,
      dataset: config.dataset,
      perspective: config.perspective,
      auth: {
        token: config.token,
      },
    });

    this._live = new SanityLiveContentProvider(this.sanityInstance, config);
  }

  async init(): Promise<void> {
    // Initialize any resources needed
    return this._live.init();
  }

  async dispose(): Promise<void> {
    // Clean up any resources
    return this._live.dispose();
  }

  async fetchById<T>(
    id: string,
    options?: {
      useCache?: boolean;
    },
  ): Promise<T | undefined> {
    const query = `*[_id == $id][0]`;
    const params = { id };
    return resolveQuery<T>(this.sanityInstance, {
      query,
      params,
      useCdn: this.config.useCdn,
      perspective: this.config.perspective,
    });
  }

  async fetchSingle<T>(
    query: string,
    options?: {
      params?: Record<string, any>;
      useCache?: boolean;
    },
  ): Promise<T | undefined> {
    const result = await resolveQuery<T>(this.sanityInstance, {
      query,
      params: options?.params,
      useCdn: this.config.useCdn,
      perspective: this.config.perspective,
    });

    return result;
  }

  async fetchMultiple<T>(
    query: string,
    options?: {
      params?: Record<string, any>;
      useCache?: boolean;
    },
  ): Promise<T[] | undefined> {
    const results = await resolveQuery<T[]>(this.sanityInstance, {
      query,
      params: options?.params,
      useCdn: this.config.useCdn,
      perspective: this.config.perspective,
    });

    if (!Array.isArray(results)) return undefined;

    return results;
  }

  async fetchRoute(options: {
    path?: string;
    routeId?: string;
    useCache?: boolean;
  }): Promise<RouteBase | undefined> {
    const { query, params } = makeRouteQuery(options.path, options.routeId);

    return this.fetchSingle<RouteBase>(query, {
      params: params,
    });
  }

  image(
    imageRef: ImageReference,
    options?: {
      width?: number;
      height?: number;
      devicePixelRatio?: number;
      quality?: number;
      format?: string;
    },
  ): string | undefined {
    const ref = this.fieldValue(
      FieldKey.ref,
      imageRef.asset as Record<string, any>,
    );

    if (!ref) return undefined;

    const image = getImage(ref, {
      projectId: this.config.projectId,
      dataset: this.config.dataset,
    });

    return image.asset.url;
  }

  fileUrl(fileRef: FileReference): string | undefined {
    const ref = this.fieldValue(
      FieldKey.ref,
      fileRef.asset as Record<string, any>,
    );

    if (!ref) return undefined;

    const fileAsset = getFile(ref, {
      projectId: this.config.projectId!,
      dataset: this.config.dataset!,
    });

    return fileAsset.asset.url;
  }

  // Override the schemaType method to handle Sanity's specific type field
  schemaType(json: Record<string, any>): string | undefined {
    return this.fieldValue(FieldKey.type, json);
  }

  // Override the reference method to handle Sanity's specific reference field
  reference(json: Record<string, any>): string | undefined {
    return json._ref;
  }
  // Override the fieldValue method to handle Sanity's specific field structure

  fieldValue(key: FieldKey, json: Record<string, any>): string | undefined {
    const fieldKey = fieldKeyMap[key];
    return json ? json[fieldKey] : undefined;
  }

  // Live content provider implementation
  override get live(): LiveContentProvider {
    return this._live;
  }

  override get supportsLive(): boolean {
    return true;
  }
}
