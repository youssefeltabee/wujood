import { NextResponse } from "next/server";
import type { ApiSuccess, ApiError, PaginatedResponse } from "@/types/api";

export function jsonOk<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
  const body: ApiSuccess<T> = { success: true, data };
  if (message) body.message = message;
  return NextResponse.json(body, { status: 200 });
}

export function jsonCreated<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
  const body: ApiSuccess<T> = { success: true, data };
  if (message) body.message = message;
  return NextResponse.json(body, { status: 201 });
}

export function jsonError(
  message: string,
  status = 400,
  code?: string,
): NextResponse<ApiError> {
  const body: ApiError = { success: false, error: message };
  if (code) body.code = code;
  return NextResponse.json(body, { status });
}

export function jsonPaginated<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): NextResponse<PaginatedResponse<T>> {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    total,
    page,
    pageSize,
  };
  return NextResponse.json(body, { status: 200 });
}

export const jsonSuccess = jsonOk;
