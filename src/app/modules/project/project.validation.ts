// project.validation.ts
import { z } from "zod";

/**
 * Helper: try parse JSON string, otherwise if comma-separated return array,
 * otherwise if already array return as-is.
 */
const toStringArray = z.preprocess((val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    const v = val.trim();
    // try JSON parse first
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not JSON
    }
    // fallback: comma separated
    if (v === "") return [];
    return v.split(",").map(s => s.trim()).filter(Boolean);
  }
  return val;
}, z.array(z.string()).optional());

export const createProjectZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    longDescription: z.string().min(1, "Long description is required"),
    category: z.string().min(1, "Category is required"),
    // tags can be: ["a","b"] or '["a","b"]' or "a,b"
    tags: toStringArray,
    demoUrl: z.string().url("demoUrl must be a valid URL"),
    githubUrl: z.string().url("githubUrl must be a valid URL"),
    challenge: z.string().min(1, "Challenge is required"),
    solution: z.string().min(1, "Solution is required"),
    // results same as tags (array of strings or stringified)
    results: toStringArray,
    duration: z.string().min(1, "Duration is required"),
    teamSize: z.string().min(1, "Team size is required"),
    client: z.string().min(1, "Client is required"),
  })
});

/**
 * Optional: partial schema for updates (all fields optional)
 */
export const updateProjectZodSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    longDescription: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    tags: toStringArray,
    demoUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    challenge: z.string().min(1).optional(),
    solution: z.string().min(1).optional(),
    results: toStringArray,
    duration: z.string().min(1).optional(),
    teamSize: z.string().min(1).optional(),
    client: z.string().min(1).optional(),
  })
});

// export TS types
export type CreateProjectInput = z.infer<typeof createProjectZodSchema>["body"];
export type UpdateProjectInput = z.infer<typeof updateProjectZodSchema>["body"];
