import { z } from 'zod';
import { insertReleaseSchema, releases } from './schema';

export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  releases: {
    list: {
      method: 'GET' as const,
      path: '/api/releases' as const,
      responses: {
        200: z.array(z.custom<typeof releases.$inferSelect>()),
      },
    },
    getLatest: {
      method: 'GET' as const,
      path: '/api/releases/latest' as const,
      responses: {
        200: z.custom<typeof releases.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    trackDownload: {
      method: 'POST' as const,
      path: '/api/releases/:id/download' as const,
      responses: {
        200: z.object({ success: z.boolean(), newCount: z.number() }),
        404: errorSchemas.notFound,
      },
    }
  },
};

export type ReleaseResponse = z.infer<typeof api.releases.getLatest.responses[200]>;

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
