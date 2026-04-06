import { Client } from '@notionhq/client'

import { env } from '@/lib/env'

// Notion API 클라이언트 싱글톤
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({
      auth: env.NOTION_API_KEY,
    })
  }
  return notionClient
}

export const notion = getNotionClient()
