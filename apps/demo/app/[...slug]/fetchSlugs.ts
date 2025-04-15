import { client } from './sanity-client';

export async function fetchSlugs() {
  const slugs: string[] = await client.fetch(
    `*[_type == "vyuh.route"]{path}.path`,
  );

  const paths = slugs
    .map((slug: string) => slug.replace(/^\/|\/$/g, ''))
    .map((slug: string) => ({ slug: slug.split('/') }));

  console.log(paths);

  return paths;
}
