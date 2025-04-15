'use client';

import { RouterProvider } from '@/components/router-provider';
import { misc } from '@/features/misc-feature';

import { NextNavigationPlugin } from '@/plugins/next-navigation-plugin';
import { PluginDescriptor, VyuhProvider } from '@vyuh/react-core';
import { DefaultContentPlugin } from '@vyuh/react-extension-content';
import { system } from '@vyuh/react-feature-system';
import { auth } from '@vyuh/react-feature-auth';
import { blog } from '@vyuh/react-feature-blog';
import { marketing } from '@vyuh/react-feature-marketing';

import { SanityContentProvider } from '@vyuh/react-plugin-content-provider-sanity';
import { ReactNode } from 'react';

import '@/app/globals.css';

const sanityProvider = new SanityContentProvider({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  perspective: 'drafts',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN!,
});

const plugins = new PluginDescriptor({
  content: new DefaultContentPlugin(),
  navigation: new NextNavigationPlugin(),
});

/**
 * Feature configuration
 * Returns all features used in the application
 */
const features = () => [system, misc, marketing, blog, auth];

export default function ClientApp({ children }: { children: ReactNode }) {
  return (
    <VyuhProvider features={features} plugins={plugins}>
      <RouterProvider>{children}</RouterProvider>
    </VyuhProvider>
  );
}
