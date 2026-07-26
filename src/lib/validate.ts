import { z, ZodSchema, ZodError } from "zod";
import { ValidationError } from "@/lib/errors";

export type Validated<T extends ZodSchema> = z.infer<T>;

export async function validateBody<T extends ZodSchema>(
  req: Request,
  schema: T,
): Promise<{ data: z.infer<T> } | { error: ValidationError }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { data };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        error: new ValidationError("Invalid request body", {
          issues: err.issues.map((e) => ({ path: e.path.join("."), message: e.message })),
        }),
      };
    }
    return { error: new ValidationError("Invalid request body") };
  }
}

export const urlSchema = z.string().url("Must be a valid URL");

export const emailSchema = z.string().email("Must be a valid email address");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const idSchema = z.string().min(8).max(12).regex(/^[a-z0-9]+$/, "Invalid ID format");
