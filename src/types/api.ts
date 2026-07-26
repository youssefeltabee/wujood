export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateSuccess<T> = {
  success: true;
  data: T;
  message: string;
};
