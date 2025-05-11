import {
  BuiltContentSchemaBuilder,
  DefaultFieldsModifier,
  FeatureDescriptor,
} from '@vyuh/sanity-schema-core';
import {
  DocumentViewDescriptor,
  RouteDescriptor,
} from '@vyuh/sanity-schema-system';
import {
  BlogGroupDescriptor,
  BlogGroupSchemaBuilder,
  defaultBlogGroupLayout,
} from './content/blog-group';
import {
  BlogPostSchemaBuilder,
  BlogPostSummaryDescriptor,
} from './content/blog-post-summary';
import { blogQueryConfig } from './content/blog-query-config';
import { blogAuthor } from './documents/blog-author';
import { blogCategory } from './documents/blog-category';
import { blogPost } from './documents/blog-post';

export const blog = new FeatureDescriptor({
  name: 'blog',
  title: 'Blog',
  description:
    'Schema for Blog components including blog posts, blog post summaries, and blog post groups',
  contents: [
    new DocumentViewDescriptor({
      documentTypes: [
        { type: blogPost.name },
        { type: blogCategory.name },
        { type: blogAuthor.name },
      ],
      queryConfigurations: [blogQueryConfig],
    }),
    new BlogGroupDescriptor({
      layouts: [defaultBlogGroupLayout],
    }),
    new RouteDescriptor({
      regionItems: [
        { type: BlogGroupDescriptor.schemaName },
        { type: BlogPostSummaryDescriptor.schemaName },
      ],
    }),
  ],
  contentSchemaBuilders: [
    new BlogPostSchemaBuilder(),
    new BlogGroupSchemaBuilder(),
    new BuiltContentSchemaBuilder(blogPost),
    new BuiltContentSchemaBuilder(blogCategory),
    new BuiltContentSchemaBuilder(blogAuthor),
  ],
  contentSchemaModifiers: [
    new DefaultFieldsModifier({
      excludedSchemaTypes: [
        { type: blogPost.name },
        { type: blogCategory.name },
        { type: blogAuthor.name },
      ],
    }),
  ],
});
