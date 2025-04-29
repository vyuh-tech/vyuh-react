import {
  ContentDescriptor,
  ContentSchemaBuilder,
} from '@vyuh/sanity-schema-core';
import { TbAbacus as Icon } from 'react-icons/tb';
import { defineField, defineType } from 'sanity';

/**
 * Accordion section schema for marketing pages
 * Based on common patterns from Tailwind UI Accordion sections
 */

/**
 * Content descriptor for Accordion content items
 */
export class AccordionDescriptor extends ContentDescriptor {
  static readonly schemaName = 'marketing.accordion';

  constructor(props: Partial<AccordionDescriptor>) {
    super(AccordionDescriptor.schemaName, props);
  }
}

/**
 * Default layout schema for Accordion content items
 */
export const defaultAccordionLayout = defineType({
  name: `${AccordionDescriptor.schemaName}.layout.default`,
  title: 'Default',
  type: 'object',
  icon: Icon,
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      description: 'The style variant for the Accordion section',
      options: {
        list: [
          { title: 'Simple three tiers', value: 'simple-three-tiers' },
          { title: 'Two tiers highlighted', value: 'two-tiers-highlighted' },
        ],
      },
      initialValue: 'simple-three-tiers',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      variant: 'variant',
    },
    prepare({ variant }) {
      const variantDisplay = variant
        ? variant
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'Simple Three Tiers';

      return {
        title: `Accordion Layout: ${variantDisplay}`,
        subtitle: 'Default',
        media: Icon,
      };
    },
  },
});

export class AccordionSchemaBuilder extends ContentSchemaBuilder {
  private schema = defineType({
    name: AccordionDescriptor.schemaName,
    title: 'Accordion Section',
    type: 'object',
    icon: Icon,
    fields: [
      defineField({
        name: 'header',
        title: 'Header',
        type: 'string',
        description: 'The main header for the Accordion section',
        validation: (Rule) => Rule.required(),
      }),

      defineField({
        name: 'items',
        title: 'Items',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              defineField({
                name: 'header',
                title: 'Header',
                type: 'string',
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: 'description',
                title: 'Description',
                type: 'text',
              }),
            ],
            preview: {
              select: {
                header: 'header',
                description: 'description',
              },
              prepare({ header, description }) {
               
                return {
                  title: `header: ${header || 'Untitled'}`,
                  subtitle: `${description.substr(0, 12)}`,
                };
              },
            },
          },
        ],
        validation: (Rule) => Rule.required().min(1),
      }),
    ],
    preview: {
      select: {
        header: 'header',
        items: 'items',
      },
      prepare({ header, items = [] }) {
        return {
          title: `Accordion: ${header || 'Untitled'}`,
          subtitle: `${items.length} item${items.length === 1 ? '' : 's'}`,
          media: Icon,
        };
      },
    },
  });

  constructor() {
    super(AccordionDescriptor.schemaName);
  }

  build(descriptors: ContentDescriptor[]) {
    return this.schema;
  }
}
