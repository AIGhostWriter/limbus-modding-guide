import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export default function CodeBlock({ code, language = 'text', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-6 border border-black/15 overflow-hidden shadow-[0_10px_30px_rgba(20,20,16,.08)]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2a2c27] border-b border-white/10">
        <div className="flex items-center gap-3">
          {title && (
            <span className="text-[11px] tracking-wide text-white/65">{title}</span>
          )}
          {language !== 'text' && (
            <span className="text-[10px] text-[#e7c878] uppercase tracking-[.14em] font-mono">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] uppercase tracking-wider text-white/45 hover:text-white transition-colors px-2 py-1"
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre className="bg-[#1c1e1b] overflow-x-auto p-5 text-[13px] leading-7">
        <code className="font-mono text-[#e8e4d8] whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}
