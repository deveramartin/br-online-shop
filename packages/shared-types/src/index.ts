// Shared TypeScript types for br-online-shop
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
};
