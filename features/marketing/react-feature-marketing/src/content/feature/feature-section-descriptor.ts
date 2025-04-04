import { Feature, FEATURE_SCHEMA_TYPE } from '@/content/feature/feature';
import { ContentDescriptor } from '@vyuh/react-extension-content';

/**
 * Content type descriptor for Feature content items
 */
export class FeatureSectionDescriptor extends ContentDescriptor<Feature> {
  constructor(props?: Partial<FeatureSectionDescriptor>) {
    super({
      schemaType: FEATURE_SCHEMA_TYPE,
      title: 'Feature',
      layouts: props?.layouts,
    });
  }
}
