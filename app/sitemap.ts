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
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Cuando se agreguen más páginas, expandir acá:
    // { url: `${baseUrl}/proceso`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // { url: `${baseUrl}/recursos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
