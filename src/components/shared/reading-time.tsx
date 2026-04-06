import { Clock } from 'lucide-react'

interface ReadingTimeProps {
  minutes: number
  className?: string
}

export function ReadingTime({ minutes, className }: ReadingTimeProps) {
  return (
    <div
      className={`text-muted-foreground flex items-center gap-1 text-sm ${className}`}
    >
      <Clock className="h-4 w-4" />
      <span>{minutes}분 읽기</span>
    </div>
  )
}
