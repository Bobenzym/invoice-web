import Image from 'next/image'

interface NotionBlock {
  type: string
  [key: string]: unknown
}

interface NotionBlockRendererProps {
  blocks: NotionBlock[]
}

export function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {blocks.map((block, index) => (
        <div key={index}>{renderBlock(block)}</div>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: any): React.ReactNode {
  const { type } = block

  switch (type) {
    case 'paragraph':
      return <ParagraphBlock block={block} />
    case 'heading_1':
      return <Heading1Block block={block} />
    case 'heading_2':
      return <Heading2Block block={block} />
    case 'heading_3':
      return <Heading3Block block={block} />
    case 'bulleted_list_item':
      return <BulletedListBlock block={block} />
    case 'numbered_list_item':
      return <NumberedListBlock block={block} />
    case 'quote':
      return <QuoteBlock block={block} />
    case 'code':
      return <CodeBlock block={block} />
    case 'image':
      return <ImageBlock block={block} />
    case 'divider':
      return <DividerBlock />
    case 'callout':
      return <CalloutBlock block={block} />
    default:
      return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRichText(richText: any[]): React.ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return richText.map((text: any, index) => {
    const { plain_text, annotations, href } = text
    const { bold, italic, strikethrough, underline, code, color } =
      annotations || {}

    let content: React.ReactNode = plain_text

    if (code) {
      content = (
        <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
          {plain_text}
        </code>
      )
    }

    if (bold) content = <strong>{content}</strong>
    if (italic) content = <em>{content}</em>
    if (strikethrough) content = <del>{content}</del>
    if (underline) content = <u>{content}</u>

    if (href) {
      content = (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {content}
        </a>
      )
    }

    const colorClass = getColorClass(color)
    if (colorClass) {
      content = <span className={colorClass}>{content}</span>
    }

    return <span key={index}>{content}</span>
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getColorClass(color: any): string {
  if (!color) return ''

  const colorMap: Record<string, string> = {
    blue: 'text-blue-600',
    blue_background: 'bg-blue-200',
    brown: 'text-amber-900',
    brown_background: 'bg-amber-200',
    gray: 'text-gray-600',
    gray_background: 'bg-gray-200',
    green: 'text-green-600',
    green_background: 'bg-green-200',
    orange: 'text-orange-600',
    orange_background: 'bg-orange-200',
    pink: 'text-pink-600',
    pink_background: 'bg-pink-200',
    purple: 'text-purple-600',
    purple_background: 'bg-purple-200',
    red: 'text-red-600',
    red_background: 'bg-red-200',
    yellow: 'text-yellow-600',
    yellow_background: 'bg-yellow-200',
  }

  return colorMap[color] || ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ParagraphBlock({ block }: { block: any }) {
  const { paragraph } = block
  const { rich_text } = paragraph || {}

  if (!rich_text || rich_text.length === 0) {
    return <p className="mb-4">&nbsp;</p>
  }

  return <p className="mb-4">{renderRichText(rich_text)}</p>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Heading1Block({ block }: { block: any }) {
  const { heading_1 } = block
  const { rich_text } = heading_1 || {}

  return (
    <h1 className="mt-8 mb-6 scroll-m-20 text-4xl font-bold tracking-tight">
      {renderRichText(rich_text || [])}
    </h1>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Heading2Block({ block }: { block: any }) {
  const { heading_2 } = block
  const { rich_text } = heading_2 || {}

  return (
    <h2 className="mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
      {renderRichText(rich_text || [])}
    </h2>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Heading3Block({ block }: { block: any }) {
  const { heading_3 } = block
  const { rich_text } = heading_3 || {}

  return (
    <h3 className="mt-6 mb-3 scroll-m-20 text-xl font-semibold tracking-tight">
      {renderRichText(rich_text || [])}
    </h3>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BulletedListBlock({ block }: { block: any }) {
  const { bulleted_list_item } = block
  const { rich_text } = bulleted_list_item || {}

  return (
    <li className="mb-2 ml-6 list-disc">{renderRichText(rich_text || [])}</li>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NumberedListBlock({ block }: { block: any }) {
  const { numbered_list_item } = block
  const { rich_text } = numbered_list_item || {}

  return (
    <li className="mb-2 ml-6 list-decimal">
      {renderRichText(rich_text || [])}
    </li>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuoteBlock({ block }: { block: any }) {
  const { quote } = block
  const { rich_text } = quote || {}

  return (
    <blockquote className="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic dark:border-gray-600 dark:text-gray-300">
      {renderRichText(rich_text || [])}
    </blockquote>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CodeBlock({ block }: { block: any }) {
  const { code } = block
  const { rich_text, language } = code || {}

  const plainText = (rich_text || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((text: any) => text.plain_text)
    .join('')

  return (
    <pre className="bg-muted mb-4 overflow-x-auto rounded-lg p-4">
      <code className={`language-${language || 'plaintext'} text-sm`}>
        {plainText}
      </code>
    </pre>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImageBlock({ block }: { block: any }) {
  const { image } = block
  const { external, file } = image || {}

  const imageUrl = external?.url || file?.url
  if (!imageUrl) return null

  return (
    <div className="relative my-6 h-80 w-full">
      <Image
        src={imageUrl}
        alt="Notion image"
        fill
        className="rounded-lg object-cover"
      />
    </div>
  )
}

function DividerBlock() {
  return <hr className="my-6" />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CalloutBlock({ block }: { block: any }): React.ReactNode {
  const { callout } = block
  const { rich_text, icon } = callout || {}

  return (
    <div className="bg-muted my-4 flex gap-3 rounded-lg p-4">
      {icon && (
        <span className="text-lg">{icon.emoji || icon.external?.url}</span>
      )}
      <div className="flex-1">{renderRichText(rich_text || [])}</div>
    </div>
  )
}
