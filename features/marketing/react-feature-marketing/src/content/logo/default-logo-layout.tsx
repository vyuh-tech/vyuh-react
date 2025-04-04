import { Logo as LogoComponent } from '@/content/logo/components/Logo';
import { Logo, LOGO_SCHEMA_TYPE } from '@/content/logo/logo';
import { LayoutConfiguration, TypeDescriptor } from '@vyuh/react-core';
import React from 'react';

/**
 * Logo layout variant type
 */
export type LogoVariant =
  | 'simple-grid'
  | 'with-borders';

/**
 * Default layout for Logo section content items
 */
export class DefaultLogoLayout extends LayoutConfiguration<Logo> {
  static readonly schemaName = `${LOGO_SCHEMA_TYPE}.layout.default`;
  static readonly typeDescriptor = new TypeDescriptor(this.schemaName, this);

  readonly variant?: LogoVariant;
  readonly columns?: number;

  constructor(props?: Partial<DefaultLogoLayout>) {
    super({
      schemaType: DefaultLogoLayout.schemaName,
      title: 'Default Logo Layout',
    });

    this.variant = props?.variant || 'simple-grid';
    this.columns = props?.columns || 4;
  }

  render(content: Logo): React.ReactNode {
    return <LogoComponent content={content} layout={this} />;
  }
}
