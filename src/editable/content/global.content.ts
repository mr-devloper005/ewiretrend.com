import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Independent reading platform',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'News, media, and public updates',
    primaryLinks: [
      { label: 'Latest Updates', href: '/updates' },
      { label: 'News Media', href: '/updates?category=news-media' },
      { label: 'Press Releases', href: '/updates?category=press-release' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse updates', href: '/updates' },
      secondary: { label: 'Submit', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Newsroom updates and distributed media',
    description: 'A modern media distribution network for press releases, company announcements, newsroom coverage, and category-led public discovery.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Latest Updates', href: '/updates' },
          { label: 'News Media', href: '/updates?category=news-media' },
          { label: 'Business News', href: '/updates?category=business' },
          { label: 'Press Releases', href: '/updates?category=press-release' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for fast, verified, and category-led media distribution.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
