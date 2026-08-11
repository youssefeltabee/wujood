import { describe, it, expect } from "vitest";
import { AppError, ValidationError, NotFoundError, UnauthorizedError, handleApiError } from "../errors";

describe("Error classes", () => {
  it("AppError has correct defaults", () => {
    const err = new AppError("test", 500, "TEST");
    expect(err.message).toBe("test");
    expect(err.statusCode).toBe(500);
  });

  it("ValidationError returns 400", () => {
    const err = new ValidationError("bad input");
    expect(err.statusCode).toBe(400);
  });

  it("NotFoundError returns 404", () => {
    const err = new NotFoundError("User");
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain("User");
  });

  it("UnauthorizedError returns 401", () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });
});

describe("handleApiError", () => {
  it("returns JSON with correct status for AppError", () => {
    const err = new ValidationError("invalid");
    const response = handleApiError(err);
    expect(response.status).toBe(400);
  });

  it("returns 500 for unknown errors", () => {
    const response = handleApiError(new Error("unknown"));
    expect(response.status).toBe(500);
  });
});
