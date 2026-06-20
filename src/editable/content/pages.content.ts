import { slot4BrandConfig } from '@/editable/theme/brand.config'

const brand = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'Media distribution, newswire & press release syndication',
      description: 'Distribute press releases, company announcements, and newsroom updates across a verified network of media outlets, journalists, and category-led channels.',
      openGraphTitle: 'Global media distribution & newswire',
      openGraphDescription: 'Place announcements in front of the right outlets with verified syndication, targeted reach, and editorial polish.',
      keywords: ['media distribution', 'press release', 'newswire', 'syndication', 'public relations', 'news media'],
    },
    hero: {
      eyebrow: 'Trusted newswire & syndication',
      // `title` is kept (string array) for the content contract; the hero renders `titleLines`.
      title: ['Global press', 'media distribution'],
      titleLines: [
        { text: 'GLOBAL PRESS', tone: 'accent' as const },
        { text: 'MEDIA DISTRIBUTION', tone: 'ink' as const },
      ],
      kicker: 'Extreme reach',
      kickerSub: 'Newswire and syndication',
      description: 'Crafting press-ready stories that reach audiences and elevate brands across every channel.',
      primaryCta: { label: 'Browse the newsroom', href: '/search' },
      secondaryCta: { label: 'Get a quote', href: '/contact' },
      socials: [
        
        
        { label: 'Newswire', href: '/search' },
        { label: 'Press', href: '/contact' },
      ],
    },
    benefits: {
      eyebrow: 'Corporate & private',
      title: ['Work with us and enjoy', 'these distribution benefits'],
      items: [
        { title: 'The Widest Reach', description: 'One submission lands across thousands of newsrooms, portals, and journalist inboxes worldwide.' },
        { title: 'Targeted Precision', description: 'Route each story to the right industry, region, and category so it reaches a relevant audience.' },
        { title: 'Verified Outlets', description: 'A curated, continuously checked network of credible media partners and syndication points.' },
        { title: 'Editorial Polish', description: 'Press-ready formatting, headlines, and summaries that read like real newsroom coverage.' },
      ],
    },
    // Kept for the content contract (at least one intro paragraph must exist).
    intro: {
      badge: 'About the network',
      title: 'Built for distributing announcements, news, and press coverage.',
      paragraphs: [
        'This platform brings press release distribution, newsroom syndication, and media discovery into one connected workflow, so announcements move from draft to coverage without friction.',
        'Instead of scattering a story across disconnected tools, releases stay connected to the right outlets, regions, and categories for faster, more relevant pickup.',
      ],
    },
    showcase: {
      eyebrow: 'Distribution aura',
      title: ['Amplifying announcements', 'from every angle'],
      description: 'Inde omnis iste natus — we put your release in front of the outlets that matter, then track the pickup as the story spreads across the wire.',
      points: [
        'Single submission, multi-channel syndication.',
        'Live category and region targeting.',
        'Publication-ready summaries and headlines.',
      ],
    },
    about: {
      eyebrow: 'About us',
      title: ['Press release writing and', 'media distribution'],
      description: 'Dicta sunt explicabo. From drafting to placement, we manage the full distribution lifecycle so your news reaches the right desks.',
    },
    stats: [
      { value: '5K+', label: 'Media outlets' },
      { value: '120', label: 'Countries reached' },
      { value: '24h', label: 'Turnaround' },
      { value: '98%', label: 'Pickup rate' },
    ],
    marquee: ['Press Releases', 'News Media', 'Syndication', 'Newswire', 'Public Relations', 'Announcements'],
    cta: {
      eyebrow: 'Ready when you are',
      title: 'Order your media distribution in newsroom quality',
      button: 'Get a quote',
      href: '/contact',
    },
    storyRail: { eyebrow: 'The daily wire', title: 'Latest distributed stories' },
    features: { eyebrow: 'Essential coverage', title: 'Featured releases' },
    briefing: { eyebrow: 'Quick reads', title: 'The briefing' },
    moreToDiscover: { eyebrow: 'From the newsroom', title: 'More to discover' },
    closing: {
      eyebrow: 'Stay informed',
      title: 'The announcements shaping what comes next.',
      description: 'Fresh releases, media pickups, newsroom perspectives, and useful public information in one focused distribution surface.',
      primaryCta: { label: 'Send a release', href: '/contact' },
      secondaryCta: { label: 'Join the network', href: '/signup' },
    },
    searchBand: {
      title: 'Search the full distribution archive',
      placeholder: 'Search releases, companies, categories',
    },
  },
  about: {
    badge: 'Our story',
    eyebrow: 'About us',
    heroTitle: 'Independent media distribution, built for clear announcements.',
    title: `A clearer way to distribute news and reach the right outlets.`,
    description: `${brand} is built to make press release distribution, newsroom syndication, and media discovery feel like one connected workflow.`,
    paragraphs: [
      'Instead of scattering your announcement across disconnected tools, we keep drafting, targeting, and placement in one place — so your story moves from idea to coverage without friction.',
      'Whether you start with a press release, a company update, or a media-led announcement, our network routes it to the right desks, regions, and categories automatically.',
    ],
    values: [
      { title: 'Distribution-first', description: 'We prioritize reach, relevance, and speed so the right outlets see your news first.' },
      { title: 'Connected channels', description: 'Press releases, news media, and category feeds stay connected for natural discovery across the wire.' },
      { title: 'Credible & trusted', description: 'A verified outlet network and clean editorial structure keep every placement trustworthy.' },
    ],
    stats: [
      { value: '5,000+', label: 'Outlets in network' },
      { value: '120', label: 'Countries covered' },
      { value: '10M+', label: 'Monthly reach' },
      { value: '24h', label: 'Avg. turnaround' },
    ],
  },
  contact: {
    eyebrow: `Contact ${brand}`,
    title: 'Tell us what you need to announce.',
    description: 'Share what you are launching, distributing, or correcting. We route it through the right desk instead of forcing every request into one generic queue.',
    formTitle: 'Send a message',
    desks: [
      { title: 'Distribution desk', body: 'Plan a release, schedule syndication, and target outlets by region and category.' },
      { title: 'Media partnerships', body: 'Discuss newswire access, syndication deals, and newsroom collaborations.' },
      { title: 'General support', body: 'Reach the team for account, publishing, or platform-related help.' },
    ],
    details: [
      { label: 'Phone', value: '1 800 458 56 97' },
      { label: 'Hours', value: 'Mon–Fri · 9am–6pm' },
    ],
  },
  search: {
    metadata: {
      title: 'Search the distribution archive',
      description: 'Search press releases, announcements, categories, and distributed media across the network.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find releases, companies, and coverage faster.',
      description: 'Use keywords, categories, and content types to surface distributed media from every active channel on the wire.',
      placeholder: 'Search by keyword, company, category, or headline',
    },
    resultsTitle: 'Latest distributed content',
  },
  create: {
    metadata: {
      title: 'Submit a release',
      description: 'Create and submit new content for distribution.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Log in to submit a release.',
      description: 'Use your account to open the publishing workspace and prepare a distribution-ready post for the active channels on this network.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Prepare content for every active channel.',
      description: 'Choose the content type, add details, and prepare a clean, distribution-ready post with summary, links, and body content.',
    },
    formTitle: 'Release details',
    submitLabel: 'Submit for distribution',
    successTitle: 'Submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: `Login to ${brand}.`,
      badge: 'Member access',
      title: 'Welcome back to your distribution desk.',
      description: 'Log in to continue browsing the wire, managing submissions, and preparing new releases from your account.',
      formTitle: 'Log in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then log in.',
      success: 'Login successful. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create your ${brand} account.`,
      badge: 'Network access',
      title: 'Create your account and start distributing.',
      description: 'Create an account to access the publishing workspace, save details, and submit releases across the network.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting…',
      loginCta: 'Log in',
    },
  },
  detailPages: {
    article: { relatedTitle: 'Related releases', fallbackTitle: 'Release details' },
    listing: { relatedTitle: 'Related listings', fallbackTitle: 'Listing details' },
    image: { relatedTitle: 'Related visuals', fallbackTitle: 'Image details' },
    profile: { relatedTitle: 'Suggested releases', fallbackDescription: 'Profile details will appear here once available.', visitButton: 'Visit official site' },
  },
} as const
