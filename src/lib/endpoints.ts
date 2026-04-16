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
  },
} as const;

export default endpoints;
