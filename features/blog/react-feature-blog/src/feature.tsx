import { BlogQueryConfig } from '@/content/blog-post/blog-query-config';
import { FeatureDescriptor } from '@vyuh/react-core';
import { ContentExtensionDescriptor } from '@vyuh/react-extension-content';
import { DocumentViewDescriptor } from '@vyuh/react-feature-system';
import { FaPagelines as Icon } from 'react-icons/fa6';
import { BlogAuthorContentBuilder } from './content/blog-author';
import { BlogCategoryContentBuilder } from './content/blog-category';
import { BlogGroupContentBuilder } from './content/blog-group/blog-group-builder';
import { BlogPostContentBuilder } from './content/blog-post';
import { BlogPostSummaryContentBuilder } from './content/blog-post-summary/blog-post-summary-builder';

export const blog = new FeatureDescriptor({
  name: 'blog',
  title: 'Blog',
  description: 'Blog components for building Blog pages',
  icon: <Icon />,
  extensions: [
    new ContentExtensionDescriptor({
      contents: [
        new DocumentViewDescriptor({
          queries: [BlogQueryConfig.typeDescriptor],
        }),
      ],
      contentBuilders: [
        new BlogGroupContentBuilder(),
        new BlogPostSummaryContentBuilder(),
        new BlogPostContentBuilder(),
        new BlogCategoryContentBuilder(),
        new BlogAuthorContentBuilder(),
      ],
    }),
  ],
});
