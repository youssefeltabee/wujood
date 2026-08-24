import { Client } from "@upstash/qstash";

export const JOB_TYPES = ["audit-scan", "pdf-generation", "cleanup"] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function enqueueJob(type: JobType, payload: Record<string, unknown>) {
  await qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${type}`,
    body: payload,
  });
}
