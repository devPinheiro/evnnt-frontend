const endpoints = {
  auth: {
    login: "/api/v1/auth/login",
    signup: "/api/v1/auth/signup",
    me: "/api/v1/auth/me",
    refresh: "/api/v1/auth/refresh",
    logout: "/api/v1/auth/logout",
  },
  events: {
    list: "/api/v1/events",
    /** POST create — same resource path as list */
    create: "/api/v1/events",
  },
  invites: {
    campaigns: "/api/v1/invites/campaigns",
    templates: "/api/v1/invites/templates",
    audiences: "/api/v1/invites/audiences",
    sites: "/api/v1/invites/sites",
    uploadMedia: "/api/v1/invites/media/upload",
    publicSite: (slug: string) => `/api/v1/invites/sites/${slug}`,
    publishSite: (slug: string) => `/api/v1/invites/sites/${slug}/publish`,
    unpublishSite: (slug: string) => `/api/v1/invites/sites/${slug}/unpublish`,
    send: (campaignId: string) => `/api/v1/invites/campaigns/${campaignId}/send`,
  },
} as const;

export default endpoints;
