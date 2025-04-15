import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: 'vX',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN!,
  perspective: 'drafts',
});

export async function fetchSlug(slug: string) {
  const response: any = await client.fetch(
    `*[_type == "vyuh.route" && path == "${slug}"][0]`,
  );
  return response;
}