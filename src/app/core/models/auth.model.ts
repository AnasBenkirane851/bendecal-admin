export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn?: number;
}

export interface AdminUser {
  email: string;
  role: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
}
