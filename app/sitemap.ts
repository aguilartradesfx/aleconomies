import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aleconomies.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Cuando se agreguen páginas, expandir acá:
    // { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // { url: `${baseUrl}/proceso`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // { url: `${baseUrl}/recursos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
