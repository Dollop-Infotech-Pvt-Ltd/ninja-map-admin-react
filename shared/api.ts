/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface AuthLoginResponse {
  success: boolean;
  message: string;
  http: string;
  data: {
    authToken: string;
    otp: string;
  };
  statusCode: number;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  http: string;
  data: {
    authToken: string;
    otp: string;
  };
  statusCode: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  http?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  statusCode?: number;
}

export interface RefreshTokenResponse {
  success?: boolean;
  message?: string;
  http?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  statusCode?: number;
  accessToken?: string;
  refreshToken?: string;
}

export interface ForgotPasswordStartResponse {
  success: boolean;
  message: string;
  http: string;
  data: {
    otp: string;
    authToken: string;
  };
  statusCode: number;
}

export interface ForgotPasswordVerifyResponse {
  success: boolean;
  message: string;
  http: string;
  data: {
    authToken: string;
  };
  statusCode: number;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  http?: string;
  statusCode?: number;
}

// Users API types
export interface BackendUser {
  id: string;
  email: string;
  fullName: string;
  mobileNumber: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  firstPage: boolean;
  lastPage: boolean;
}
