'use client';
import { Banner as BannerItem } from '@/content/banner/banner';
import { DefaultBannerLayout } from '@/content/banner/default-banner-layout';
import { cn } from '@/shared/utils';
import { executeAction } from '@vyuh/react-core';
import React, { useState } from 'react';
import { BannerContent } from './BannerContent';
import { BannerDismiss } from './BannerDismiss';
import { BannerIcon } from './BannerIcon';

interface BannerProps {
  content: BannerItem;
  layout: DefaultBannerLayout;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  content,
  layout,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const colorScheme = layout.colorScheme || 'default';

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Color classes that work with all Daisy UI themes
  const colorClasses = {
    default: 'bg-base-200 text-base-content',
    info: 'bg-info/20 text-info',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    brand: 'bg-primary/20 text-primary',
    // Add a fallback for any undefined color scheme
    fallback: 'bg-base-200 text-base-content',
  };

  // If banner is not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        `alert flex items-center justify-between rounded-none border-none p-4 shadow-none transition-all duration-300`,
        colorClasses[colorScheme as keyof typeof colorClasses] ||
          colorClasses.fallback,
        className,
      )}
    >
      <div className="flex items-center">
        {content.icon && (
          <BannerIcon icon={content.icon} className="mr-3 flex-shrink-0" />
        )}
        <BannerContent text={content.text} />
        {content.action && (
          <button
            type="button"
            className="btn btn-link"
            onClick={() => executeAction(content.action)}
          >
            {content.action.title}
          </button>
        )}
      </div>

      {content.dismissible && (
        <BannerDismiss
          dismissText={content.dismissText}
          className="ml-2 flex-shrink-0"
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};
