import {
  ContentItem,
  ObjectReference,
  SchemaItem,
  useVyuhStore,
} from '@vyuh/react-core';

/**
 * Schema type for DocumentView content
 */
export const DOCUMENT_VIEW_SCHEMA_TYPE = 'vyuh.document.view';

/**
 * Document load strategy
 */
export enum DocumentLoadStrategy {
  REFERENCE = 'reference',
  QUERY = 'query',
}

/**
 * Query configuration interface
 */
export abstract class QueryConfiguration implements SchemaItem {
  readonly schemaType: string;
  readonly title?: string;

  protected constructor(props: { schemaType: string; title?: string }) {
    this.schemaType = props.schemaType;
    this.title = props.title;
  }

  /**
   * Build a query string from the configuration
   */
  abstract buildQuery(): string | null;

  static fromJson(json: DocumentView): QueryConfiguration | undefined {
    const config = Array.isArray(json.query) ? json.query[0] : undefined;

    if (!config) {
      return undefined;
    }

    const { plugins } = useVyuhStore.getState();
    const schemaType = config
      ? plugins.content.provider.schemaType(config)
      : undefined;

    const TD = schemaType
      ? plugins.content.getItem(QueryConfiguration, schemaType)
      : undefined;

    if (TD) {
      return new TD.fromJson(config);
    }

    throw new Error(
      `No Query Configuration found for schemaType: ${schemaType}`,
    );
  }
}

/**
 * DocumentView content type
 *
 * Represents a view that loads and displays a document
 */
export interface DocumentView extends ContentItem {
  schemaType: typeof DOCUMENT_VIEW_SCHEMA_TYPE;

  /**
   * Optional title for the document view
   */
  title?: string;

  /**
   * Reference to a document
   */
  reference?: ObjectReference;

  /**
   * Strategy for loading the document
   */
  loadStrategy: DocumentLoadStrategy;

  /**
   * Query configuration for loading documents
   */
  query?: QueryConfiguration;
}
