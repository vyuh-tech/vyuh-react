import { TypeDescriptor } from '@vyuh/react-core';
import { ContentDescriptor } from '@vyuh/react-extension-content';
import { DOCUMENT_VIEW_SCHEMA_TYPE, QueryConfiguration } from './document-view';

/**
 * Descriptor for DocumentView content
 */
export class DocumentViewDescriptor extends ContentDescriptor {
  /**
   * List of query configurations that can be used with this view
   */
  queries?: TypeDescriptor<QueryConfiguration>[];

  constructor(props?: {
    documentTypes?: TypeDescriptor<any>[];
    queries?: TypeDescriptor<QueryConfiguration>[];
    layouts?: TypeDescriptor<any>[];
  }) {
    super({
      schemaType: DOCUMENT_VIEW_SCHEMA_TYPE,
      title: 'Document View',
    });

    this.queries = props?.queries;
  }
}
