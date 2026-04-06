import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

/**
 * Markdown을 HTML로 변환
 * @param markdown 마크다운 문자열
 * @returns HTML 문자열
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)

  const vfile = await processor.process(markdown)
  return String(vfile)
}

/**
 * Unified 프로세서 인스턴스 (재사용용)
 */
export const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify)
