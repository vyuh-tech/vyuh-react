import { Accordion as AccordionContent, ACCORDION_SCHEMA_TYPE } from '@/content/Accordion/accordion';
import { Accordion } from '@/content/Accordion/components/Accordion';
import { LayoutConfiguration, TypeDescriptor } from '@vyuh/react-core';
import React from 'react';

/**
 * Accordion layout variant type
 */
export type AccordionVariant = 'simple' | 'floating';

/**
 * The color scheme for the Accordion
 */
export type AccordionColorScheme =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'brand';

/**
 * Default layout for Accordion content items
 */
export class DefaultAccordionLayout extends LayoutConfiguration<AccordionContent> {
  static readonly schemaName = `${ACCORDION_SCHEMA_TYPE}.layout.default`;
  static readonly typeDescriptor = new TypeDescriptor(this.schemaName, this);

  readonly variant?: AccordionVariant;
  readonly colorScheme?: AccordionColorScheme;

  constructor(props?: Partial<DefaultAccordionLayout>) {
    super({
      schemaType: DefaultAccordionLayout.schemaName,
      title: 'Default Accordion Layout',
    });

    this.variant = props?.variant || 'simple';
    this.colorScheme = props?.colorScheme || 'default';
  }

  render(content: AccordionContent): React.ReactNode {
    const variant = this.variant || 'simple';

    switch (variant) {
      case 'floating':
        return (
          <div className="fixed bottom-4 right-4 z-50 max-w-md">
            <Accordion content={content} layout={this} />
          </div>
        );
      case 'simple':
      default:
        return <Accordion content={content} layout={this} />;
    }
  }
}
