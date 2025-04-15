import { fetchSlugs } from '@/app/[...slug]/fetchSlugs';
import { RouteLoaderNext } from '@vyuh/react-extension-content';
import { ContentItem, PluginDescriptor, VyuhProvider } from '@vyuh/react-core';
import { DefaultContentPlugin } from '@vyuh/react-extension-content';
import { client, fetchSlug } from './sanity-client';
import { system } from '@vyuh/react-feature-system';
import { auth } from '@vyuh/react-feature-auth';
import { blog } from '@vyuh/react-feature-blog';
import { marketing } from '@vyuh/react-feature-marketing';
// Use only if you want to pre-render all routes
export async function generateStaticParams() {
  return await fetchSlugs();
}

const plugins = new PluginDescriptor({
  content: new DefaultContentPlugin(),
});

const features = () => [system, marketing];

export default async function DynamicRoute({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const allParams = await params;
  const slug = Array.isArray(allParams.slug)
    ? `/${allParams.slug.join('/')}`
    : `/${allParams.slug ?? ''}`;

  const data: ContentItem = await fetchSlug(slug);
  console.log('>>>>>>');
  console.log(data);
  return (
    <RouteLoaderNext
      renderContent={plugins.content.render}
      features={features}
      data={data}
      url={slug}
      allowRefresh={true}
      live={true}
    />
  );
}
