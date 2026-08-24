import "@testing-library/jest-dom/vitest";

// env.ts validates presence at first parse; unit tests never touch a real DB.
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
