import { NextResponse } from "next/server";

type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

// ponytail: response envelope helpers; only the shapes audit.controller uses survive
export function jsonOk<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
  const body: ApiSuccess<T> = { success: true, data };
  if (message) body.message = message;
  return NextResponse.json(body, { status: 200 });
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

export function jsonAccepted<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
  const body: ApiSuccess<T> = { success: true, data };
  if (message) body.message = message;
  return NextResponse.json(body, { status: 202 });
}
