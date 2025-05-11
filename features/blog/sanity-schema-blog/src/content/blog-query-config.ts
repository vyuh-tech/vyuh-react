import { defineField, defineType } from 'sanity';
import { TbArticle as Icon } from 'react-icons/tb';

export const blogQueryConfig = defineType({
  name: 'blog.query.config',
  title: 'Blog Query Configuration',
  type: 'object',
  icon: Icon,
  fields: [
    defineField({
      name: 'count',
      title: 'Latest Posts Count',
      description: 'Number of latest posts to fetch',
      type: 'number',
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      count: 'count',
    },
    prepare({ count }) {
      return {
        title: `Blog Query Configuration`,
        subtitle: `Fetch ${count} latest posts`,
      };
    },
  },
});
