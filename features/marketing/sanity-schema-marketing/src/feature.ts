import {
  BuiltContentSchemaBuilder,
  FeatureDescriptor,
} from '@vyuh/sanity-schema-core';
import {
  DocumentDescriptor,
  RouteDescriptor,
} from '@vyuh/sanity-schema-system';
import {
  BannerDescriptor,
  BannerSchemaBuilder,
  defaultBannerLayout,
} from './content/banner';
import {
  BentoDescriptor,
  BentoSchemaBuilder,
  defaultBentoLayout,
} from './content/bento';
import {
  CTADescriptor,
  CTASchemaBuilder,
  defaultCTALayout,
} from './content/cta';
import {
  defaultFaqLayout,
  FAQDescriptor,
  FAQSchemaBuilder,
} from './content/faq';
import {
  defaultFeatureLayout,
  FeatureSectionDescriptor,
  FeatureSectionSchemaBuilder,
} from './content/feature';
import {
  defaultFooterLayout,
  FooterDescriptor,
  FooterSchemaBuilder,
} from './content/footer';
import {
  defaultHeaderLayout,
  HeaderDescriptor,
  HeaderSchemaBuilder,
} from './content/header';
import {
  defaultHeroLayout,
  HeroDescriptor,
  HeroSchemaBuilder,
} from './content/hero';
import {
  defaultLogoLayout,
  LogoDescriptor,
  LogoSchemaBuilder,
} from './content/logo';
import {
  defaultNewsletterLayout,
  NewsletterDescriptor,
  NewsletterSchemaBuilder,
} from './content/newsletter';
import {
  defaultPricingLayout,
  PricingDescriptor,
  PricingSchemaBuilder,
} from './content/pricing';
import {
  defaultStatsLayout,
  StatsDescriptor,
  StatsSchemaBuilder,
} from './content/stats';
import {
  defaultTeamLayout,
  TeamDescriptor,
  TeamSchemaBuilder,
} from './content/team';
import {
  defaultTestimonialsLayout,
  TestimonialsDescriptor,
  TestimonialsSchemaBuilder,
} from './content/testimonials';
import {
  defaultAccordionLayout,
  AccordionDescriptor,
  AccordionSchemaBuilder,
} from './content/accordion';
import { fullPageRouteLayout } from './extensions';

export const marketing = new FeatureDescriptor({
  name: 'marketing',
  title: 'Marketing',
  description:
    'Schema for marketing components including banners, headers, heroes, logos, logo clouds, features, bento grids, stats, testimonials, pricing, FAQs, CTAs, newsletters, blog sections, team sections, and footers',
  contents: [
    new HeroDescriptor({
      layouts: [defaultHeroLayout],
    }),
    new AccordionDescriptor({
      layouts: [defaultAccordionLayout],
    }),
    new FeatureSectionDescriptor({
      layouts: [defaultFeatureLayout],
    }),
    new BannerDescriptor({
      layouts: [defaultBannerLayout],
    }),
    new CTADescriptor({
      layouts: [defaultCTALayout],
    }),
    new FAQDescriptor({
      layouts: [defaultFaqLayout],
    }),
    new HeaderDescriptor({
      layouts: [defaultHeaderLayout],
    }),
    new FooterDescriptor({
      layouts: [defaultFooterLayout],
    }),
    new LogoDescriptor({
      layouts: [defaultLogoLayout],
    }),
    new BentoDescriptor({
      layouts: [defaultBentoLayout],
    }),
    new NewsletterDescriptor({
      layouts: [defaultNewsletterLayout],
    }),
    new PricingDescriptor({
      layouts: [defaultPricingLayout],
    }),
    new StatsDescriptor({
      layouts: [defaultStatsLayout],
    }),
    new TeamDescriptor({
      layouts: [defaultTeamLayout],
    }),
    new TestimonialsDescriptor({
      layouts: [defaultTestimonialsLayout],
    }),
    new RouteDescriptor({
      layouts: [fullPageRouteLayout],
      regionItems: [
        { type: BannerDescriptor.schemaName },
        { type: AccordionDescriptor.schemaName },
        { type: HeaderDescriptor.schemaName },
        { type: HeroDescriptor.schemaName },
        { type: LogoDescriptor.schemaName },
        { type: FeatureSectionDescriptor.schemaName },
        { type: BentoDescriptor.schemaName },
        { type: StatsDescriptor.schemaName },
        { type: TestimonialsDescriptor.schemaName },
        { type: PricingDescriptor.schemaName },
        { type: FAQDescriptor.schemaName },
        { type: CTADescriptor.schemaName },
        { type: NewsletterDescriptor.schemaName },
        { type: TeamDescriptor.schemaName },
        { type: FooterDescriptor.schemaName },
      ],
    }),
  ],
  contentSchemaBuilders: [
    new BannerSchemaBuilder(),
    new AccordionSchemaBuilder(),
    new HeaderSchemaBuilder(),
    new HeroSchemaBuilder(),
    new LogoSchemaBuilder(),
    new FeatureSectionSchemaBuilder(),
    new BentoSchemaBuilder(),
    new StatsSchemaBuilder(),
    new TestimonialsSchemaBuilder(),
    new PricingSchemaBuilder(),
    new FAQSchemaBuilder(),
    new CTASchemaBuilder(),
    new NewsletterSchemaBuilder(),
    new TeamSchemaBuilder(),
    new FooterSchemaBuilder(),
  ],
});
