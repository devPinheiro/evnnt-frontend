/** Preset banner gradients from the dashboard design (evvnt-dashboard-v2). */
export const evvntBannerImage = {
  1: "var(--background-image-evvnt-banner-1)",
  2: "var(--background-image-evvnt-banner-2)",
  3: "var(--background-image-evvnt-banner-3)",
  new: "var(--background-image-evvnt-banner-new)",
  5: "var(--background-image-evvnt-banner-5)",
} as const;

export type EvvntBannerKey = keyof typeof evvntBannerImage;
