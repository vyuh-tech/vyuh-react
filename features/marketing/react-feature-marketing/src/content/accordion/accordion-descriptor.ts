import { Accordion, ACCORDION_SCHEMA_TYPE } from '@/content/Accordion/accordion';
import { ContentDescriptor } from '@vyuh/react-extension-content';

/**
 * Content type descriptor for Accordion content items
 */
export class AccordionDescriptor extends ContentDescriptor<Accordion> {
  constructor(props?: Partial<AccordionDescriptor>) {
    super({
      schemaType: ACCORDION_SCHEMA_TYPE,
      title: 'Accordion',
      layouts: props?.layouts,
    });
  }
}
