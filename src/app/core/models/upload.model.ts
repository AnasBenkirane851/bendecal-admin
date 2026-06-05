export interface PresignRequest {
  slug: string;
  filename: string;
}

export interface PresignResponse {
  key: string;
  uploadUrl: string;
}
