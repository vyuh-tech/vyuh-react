import { Accordion, ACCORDION_SCHEMA_TYPE } from '@/content/Accordion/accordion';
import { DefaultAccordionLayout } from '@/content/Accordion/default-accordion-layout';
import { ContentBuilder } from '@vyuh/react-extension-content';

/**
 * Content builder for Accordion content items
 */
export class AccordionContentBuilder extends ContentBuilder<Accordion> {
  constructor() {
    super({
      schemaType: ACCORDION_SCHEMA_TYPE,
      defaultLayout: new DefaultAccordionLayout(),
      defaultLayoutDescriptor: DefaultAccordionLayout.typeDescriptor,
    });
  }
}