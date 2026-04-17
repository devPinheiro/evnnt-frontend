/** Default toast copy for TanStack mutations — aligned with EHR `SUCCESS_MESSAGES` / `ERROR_MESSAGES`. */
export const SUCCESS_MESSAGES = {
  delete: "Deleted successfully",
  patch: "Updated successfully",
  put: "Updated successfully",
  post: "Created successfully",
  get: "Retrieved successfully",
  postForm: "Uploaded successfully",
} as const;

export const MUTATION_ERROR_FALLBACKS = {
  delete: "Failed to delete — please try again",
  patch: "Failed to update — please try again",
  put: "Failed to update — please try again",
  post: "Failed to create — please try again",
  get: "Failed to retrieve — please try again",
  postForm: "Failed to upload — please try again",
} as const;
