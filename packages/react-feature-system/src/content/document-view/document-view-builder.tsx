import { DocumentViewDescriptor } from '@/content/document-view/document-view-descriptor';
import { useVyuhStore } from '@vyuh/react-core';
import { ContentBuilder } from '@vyuh/react-extension-content';
import { DefaultDocumentViewLayout } from './default-document-view-layout';
import {
  DOCUMENT_VIEW_SCHEMA_TYPE,
  DocumentView,
  QueryConfiguration,
} from './document-view';

/**
 * Content builder for DocumentView content items
 */
export class DocumentViewContentBuilder extends ContentBuilder<DocumentView> {
  constructor() {
    super({
      schemaType: DOCUMENT_VIEW_SCHEMA_TYPE,
      defaultLayout: new DefaultDocumentViewLayout(),
      defaultLayoutDescriptor: DefaultDocumentViewLayout.typeDescriptor,
    });
  }

  init(descriptors: any[]) {
    super.init(descriptors);

    // Filter for document view descriptors
    const documentViewDescriptors = descriptors as DocumentViewDescriptor[];

    // Extract all queries from the descriptors
    const queries = documentViewDescriptors.flatMap(
      (desc) => desc.queries || [],
    );

    const { content } = useVyuhStore.getState().plugins;
    for (const query of queries) {
      content.registerItem(QueryConfiguration, query);
    }
  }
}
