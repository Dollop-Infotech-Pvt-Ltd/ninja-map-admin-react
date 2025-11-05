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
  profilePicture?: string;
  avatar?: string;
  isActive?: boolean;
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

// Permissions API types
export type PermissionType = "READ" | "WRITE" | "DELETE" | "CREATE";

export interface Permission {
  permissionId: string;
  resource: string;
  action: string;
  type: PermissionType;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PermissionsResponse extends ApiResponse<Permission[]> {}

export interface PermissionResponse extends ApiResponse<Permission> {}
