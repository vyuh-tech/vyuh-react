import { BannerContentBuilder } from '@/content/banner/banner-builder';
import { AccordionContentBuilder } from '@/content/accordion/accordion-builder';
import { BentoContentBuilder } from '@/content/bento/bento-builder';
import { CTAContentBuilder } from '@/content/cta/cta-builder';
import { FAQContentBuilder } from '@/content/faq/faq-builder';
import { FeatureContentBuilder } from '@/content/feature/feature-builder';
import { FooterContentBuilder } from '@/content/footer/footer-builder';
import { HeaderContentBuilder } from '@/content/header/header-builder';
import { HeroContentBuilder } from '@/content/hero/hero-builder';
import { LogoContentBuilder } from '@/content/logo/logo-builder';
import { NewsletterContentBuilder } from '@/content/newsletter/newsletter-builder';
import { PricingContentBuilder } from '@/content/pricing/pricing-builder';
import { StatsContentBuilder } from '@/content/stats/stats-builder';
import { TeamContentBuilder } from '@/content/team/team-builder';
import { TestimonialsContentBuilder } from '@/content/testimonials/testimonials-builder';
import { FullPageRouteLayout } from '@/extensions/route/full-page-route-layout';
import { FeatureDescriptor } from '@vyuh/react-core';
import { ContentExtensionDescriptor } from '@vyuh/react-extension-content';
import { RouteDescriptor } from '@vyuh/react-feature-system';

/**
 * Marketing feature descriptor
 *
 * Provides components for building marketing pages:
 * - Banner sections
 * - Bento grid layouts
 * - CTA sections
 * - FAQ sections
 * - Feature sections
 * - Footer components
 * - Header components
 * - Hero sections
 * - Logo sections
 * - Newsletter sections
 * - Pricing sections
 * - Stats sections
 * - Team sections
 * - Testimonials sections
 */
export const marketing = new FeatureDescriptor({
  name: 'marketing',
  title: 'Marketing',
  description: 'Marketing components for building marketing pages',
  icon: 'layout-grid',
  extensions: [
    new ContentExtensionDescriptor({
      contents: [
        new RouteDescriptor({
          layouts: [FullPageRouteLayout.typeDescriptor],
        }),
      ],
      contentBuilders: [
        new HeroContentBuilder(),
        new FeatureContentBuilder(),
        new AccordionContentBuilder(),
        new BannerContentBuilder(),
        new FAQContentBuilder(),
        new CTAContentBuilder(),
        new HeaderContentBuilder(),
        new BentoContentBuilder(),
        new FooterContentBuilder(),
        new LogoContentBuilder(),
        new NewsletterContentBuilder(),
        new PricingContentBuilder(),
        new StatsContentBuilder(),
        new TeamContentBuilder(),
        new TestimonialsContentBuilder(),
      ],
    }),
  ],
});
