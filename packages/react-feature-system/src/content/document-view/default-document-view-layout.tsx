import {
  ContentItem,
  LayoutConfiguration,
  TypeDescriptor,
  useVyuh,
  useVyuhStore,
} from '@vyuh/react-core';
import { AsyncContentContainer } from '@vyuh/react-extension-content';
import React from 'react';
import {
  DOCUMENT_VIEW_SCHEMA_TYPE,
  DocumentLoadStrategy,
  DocumentView,
  QueryConfiguration,
} from './document-view';

/**
 * Default layout for DocumentView content items
 */
export class DefaultDocumentViewLayout extends LayoutConfiguration<DocumentView> {
  static readonly schemaName = `${DOCUMENT_VIEW_SCHEMA_TYPE}.layout.default`;
  static readonly typeDescriptor = new TypeDescriptor(this.schemaName, this);

  constructor() {
    super({
      schemaType: DefaultDocumentViewLayout.schemaName,
      title: 'Default Document View Layout',
    });
  }

  /**
   * Render the document view content
   */
  render(content: DocumentView): React.ReactNode {
    return <DocumentViewComponent content={content} />;
  }
}

/**
 * Document view component props
 */
export interface DocumentViewComponentProps {
  content: DocumentView;
  itemLayout?: LayoutConfiguration<ContentItem>;
}

/**
 * Document view component
 */
export const DocumentViewComponent: React.FC<DocumentViewComponentProps> = ({
  content,
  itemLayout,
}) => {
  const { plugins } = useVyuh();

  // Function to fetch document data
  const fetchContent: () => Promise<
    ContentItem | ContentItem[] | undefined
  > = async () => {
    const schemaType = plugins.content.provider.schemaType(content);

    switch (content.loadStrategy) {
      case DocumentLoadStrategy.REFERENCE:
        const ref = content.reference
          ? plugins.content.provider.reference(content.reference)
          : undefined;

        const documentId = ref;
        if (!documentId) {
          return Promise.reject(
            new Error(`No valid Document ID set for ${schemaType}`),
          );
        }

        return plugins.content.provider.fetchById<DocumentView>(documentId);

      case DocumentLoadStrategy.QUERY:
        const queryConfig = QueryConfiguration.fromJson(content);

        if (!queryConfig) {
          return Promise.reject(
            new Error(
              `No Document query configuration found for document type: ${schemaType}`,
            ),
          );
        }

        const query = queryConfig.buildQuery();
        if (!query) {
          return Promise.reject(
            new Error(
              `Could not build a Document query for document type: ${schemaType}`,
            ),
          );
        }

        return plugins.content.provider.fetchSingle(query);

      default:
        return Promise.reject(
          new Error(`Unsupported load strategy: ${content.loadStrategy}`),
        );
    }
  };

  // Function to render the document content
  const renderContent = (document?: ContentItem | ContentItem[]) => {
    const { plugins } = useVyuhStore.getState();

    if (!document) {
      return <div className="vfs:p-4">No document found</div>;
    }

    if (Array.isArray(document)) {
      return (
        <div className="vfs:p-4">
          <div className="vfs:space-y-4">
            {document.map((item, index) => (
              <div key={index}>{plugins.content.render(item, itemLayout)}</div>
            ))}
          </div>
        </div>
      );
    }

    return plugins.content.render(document, itemLayout);
  };

  return (
    <AsyncContentContainer
      fetchContent={fetchContent}
      renderContent={renderContent}
      errorTitle="No document found"
    />
  );
};
