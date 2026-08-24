import { describe, it, expect } from "vitest";
import { validateUrl, isPrivateIP, containsPrivateIP } from "../url-validation";

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

describe("isPrivateIP — IPv4 SSRF table", () => {
  const blocked = [
    "169.254.169.254", // AWS metadata
    "169.254.1.1", // link-local
    "127.0.0.1",
    "127.8.8.8",
    "10.0.0.1",
    "10.255.255.255",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "0.0.0.0",
    "100.64.0.1",
  ];
  it.each(blocked)("blocks %s", (ip) => {
    expect(isPrivateIP(ip)).toBe(true);
  });

  it.each(["172.15.0.1", "172.32.0.1", "8.8.8.8", "1.1.1.1"])("allows public %s", (ip) => {
    expect(isPrivateIP(ip)).toBe(false);
  });
});

describe("isPrivateIP — IPv6 SSRF table", () => {
  it.each(["::1", "::", "fe80::1", "FE80::abcd", "fc00::1", "fd12:3456::1", "::ffff:10.0.0.1"])(
    "blocks %s",
    (ip) => {
      expect(isPrivateIP(ip)).toBe(true);
    },
  );

  it.each(["2001:4860:4860::8888", "2606:4700::1111"])("allows public %s", (ip) => {
    expect(isPrivateIP(ip)).toBe(false);
  });
});

describe("containsPrivateIP — mixed resolution lists", () => {
  it("rejects when ANY resolved address is private", () => {
    expect(containsPrivateIP([{ address: "8.8.8.8" }, { address: "10.0.0.1" }])).toBe(true);
    expect(containsPrivateIP([{ address: "2001::1" }, { address: "::ffff:127.0.0.1" }])).toBe(true);
    expect(containsPrivateIP([{ address: "1.1.1.1" }, { address: "169.254.169.254" }])).toBe(true);
  });

  it("allows all-public lists", () => {
    expect(containsPrivateIP([{ address: "8.8.8.8" }, { address: "1.1.1.1" }])).toBe(false);
    expect(containsPrivateIP([])).toBe(false);
  });
});
