import { Action, ContentItem } from '@vyuh/react-core';
import { IconName } from 'lucide-react/dynamic';

export const ACCORDION_SCHEMA_TYPE = 'marketing.accordion';

/**
 * Accordion content item for displaying Accordion elements
 *
 * Accordion can include:
 * - Header message
 * - Optional items
 */
export interface Accordion extends ContentItem {
  /**
   * The main header to display in the Accordion
   */
  readonly header: string;

  /**
   * Pricing plans to display
   */
  readonly items: Array<{
    /**
     * header name
     */
    readonly header: string;

    /**
     * Plan description
     */
    readonly description?: string;
  }>;
}
