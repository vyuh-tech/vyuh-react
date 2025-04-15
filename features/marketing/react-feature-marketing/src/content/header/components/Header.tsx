'use client';
import { DefaultHeaderLayout } from '@/content/header/default-header-layout';
import { Header as HeaderItem } from '@/content/header/header';
import { cn } from '@/shared/utils';
import React, { useEffect, useState } from 'react';
import { DesktopNavigation } from './DesktopNavigation';
import { Logo } from './Logo';
import { MobileMenu, MobileMenuButton } from './MobileMenu';

interface HeaderProps {
  content: HeaderItem;
  layout: DefaultHeaderLayout;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  content,
  layout,
  className,
}) => {
  const variant = layout.variant || 'simple';
  const showThemeSwitch = layout.showThemeSwitch ?? true; // Default to true if not specified
  const sticky = layout.sticky ?? false; // Default to false if not specified
  const mobileMenuId = 'mobile-menu-drawer';

  // State to track if the page has been scrolled
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle scroll events
  useEffect(() => {
    if (!sticky) return; // Only add scroll listener if sticky is enabled

    const handleScroll = () => {
      // Check if page is scrolled more than 10px to add shadow
      setIsScrolled(window.scrollY > 10);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sticky]);

  return (
    <header
      className={cn('drawer bg-base-100/50 backdrop-blur-xl', className, {
        'sticky top-0 z-30 transition-shadow duration-200': sticky,
        'shadow-md': sticky && isScrolled,
      })}
    >
      <input id={mobileMenuId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="container mx-auto px-4">
          <div className={cn('navbar px-0')}>
            {/* Logo section - always visible */}
            <div className="navbar-start">
              <Logo content={content} className="navbar-item" />
            </div>

            {variant === 'with-navigation' && (
              <>
                {/* Mobile menu button */}
                <div className="navbar-end lg:hidden">
                  <MobileMenuButton id={mobileMenuId} />
                </div>

                {/* Desktop navigation and actions */}
                <DesktopNavigation
                  navigationItems={content.navigationItems}
                  actions={content.actions}
                  showThemeSwitch={showThemeSwitch}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        id={mobileMenuId}
        navigationItems={content.navigationItems}
        actions={content.actions}
        showThemeSwitch={showThemeSwitch}
      />
    </header>
  );
};
