import { TypeDescriptor } from '@vyuh/react-core';
import { QueryConfiguration } from '@vyuh/react-feature-system';

export class BlogQueryConfig extends QueryConfiguration {
  static readonly schemaName = 'blog.query.config';
  static readonly typeDescriptor = new TypeDescriptor(this.schemaName, this);

  readonly count?: number;

  constructor(props?: Partial<BlogQueryConfig>) {
    super({
      schemaType: BlogQueryConfig.schemaName,
      title: 'Blog Query Configuration',
    });

    this.count = props?.count || 3;
  }

  buildQuery() {
    return `
*[_type == "blog.post"] | order(publishedAt desc) [0..${this.count}]{
  _type,
  publishedAt,
  title,
  "slug": slug.current,
  featuredImage,
  featured,
  excerpt,
}`;
  }
}
