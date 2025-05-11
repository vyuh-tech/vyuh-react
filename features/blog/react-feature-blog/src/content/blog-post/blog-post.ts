import { ContentItem, ImageReference } from '@vyuh/react-core';
import { PortableText } from '@vyuh/react-feature-system';
import { BlogAuthor } from '../blog-author/blog-author';
import { BlogCategory } from '../blog-category/blog-category';

export const BLOG_POST_SCHEMA_TYPE = 'blog.post';

/**
 * Blog post content item for displaying a full blog post
 *
 * Blog post includes:
 * - Title
 * - Content
 * - Featured image
 * - Publication date
 * - Author information
 * - Categories
 */
export interface BlogPost extends ContentItem {
  /**
   * The title of the blog post
   */
  readonly title: string;

  /**
   * The slug for the blog post's page
   */
  readonly slug: {
    readonly current: string;
  };

  /**
   * A short summary of the post
   */
  readonly excerpt?: string;

  /**
   * Featured image for the blog post
   */
  readonly featuredImage?: ImageReference;

  /**
   * The main content of the blog post
   */
  readonly content?: PortableText;

  /**
   * The author of the blog post
   */
  readonly author?: BlogAuthor;

  /**
   * Categories this blog post belongs to
   */
  readonly categories?: Array<BlogCategory>;

  /**
   * The date and time when the blog post was published
   */
  readonly publishedAt: string;

  /**
   * Whether this post should be featured
   */
  readonly featured?: boolean;

  /**
   * SEO metadata for the blog post
   */
  readonly seo?: {
    readonly metaTitle?: string;
    readonly metaDescription?: string;
    readonly keywords?: string[];
  };
}
