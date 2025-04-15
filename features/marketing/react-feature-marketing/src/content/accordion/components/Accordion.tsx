import { Accordion as AccordionItem } from '@/content/Accordion/accordion';
import { DefaultAccordionLayout } from '@/content/Accordion/default-accordion-layout';
import React from 'react';

interface AccordionProps {
  content: AccordionItem;
  layout: DefaultAccordionLayout;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  content,
  layout,
  className,
}) => {
  const colorScheme = layout.colorScheme || 'default';
  return (
    <div className="p-4">
      {content.header && <div className='text-3xl font-semibold tracking-tight pb-4 text-balance'>{content.header}</div>}
      {content.items?.map((item, idx) => {
        return (
          <div
            key={idx}
            className="bg-base-100 border-base-300 collapse border"
          >
            <input type="radio" name="my-accordion-1" defaultChecked />
            <div className="collapse-title font-semibold">{item.header}</div>
            <div className="collapse-content text-sm">{item.description}</div>
          </div>
        );
      })}
    </div>
  );
};
