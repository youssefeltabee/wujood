import { describe, it, expect } from "vitest";
import { validateUrl } from "../url-validation";

describe("validateUrl", () => {
  it("rejects private IPs", () => {
    expect(() => validateUrl("http://192.168.1.1")).toThrow();
    expect(() => validateUrl("http://10.0.0.1")).toThrow();
    expect(() => validateUrl("http://172.16.0.1")).toThrow();
  });

  it("rejects localhost", () => {
    expect(() => validateUrl("http://localhost")).toThrow();
    expect(() => validateUrl("http://localhost:3000")).toThrow();
  });

  it("rejects non-http protocols", () => {
    expect(() => validateUrl("ftp://example.com")).toThrow();
    expect(() => validateUrl("file:///etc/passwd")).toThrow();
  });

  it("accepts public URLs", () => {
    expect(() => validateUrl("https://example.com")).not.toThrow();
    expect(() => validateUrl("https://google.com")).not.toThrow();
  });
});
