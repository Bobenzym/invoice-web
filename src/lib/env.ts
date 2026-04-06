import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  // Notion API (서버 전용)
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  NOTION_BLOG_DATABASE_ID: z
    .string()
    .min(1, 'NOTION_BLOG_DATABASE_ID is required'),
  // Site URL
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('Invalid NEXT_PUBLIC_SITE_URL')
    .default('http://localhost:3000'),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_BLOG_DATABASE_ID: process.env.NOTION_BLOG_DATABASE_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})

export type Env = z.infer<typeof envSchema>
