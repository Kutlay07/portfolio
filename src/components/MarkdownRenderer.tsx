
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './MarkdownRenderer.css'

type MarkdownRendererProps = {
    content: string
}

function MarkdownRenderer({
    content,
}: MarkdownRendererProps) {
    return (
        <article className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
        </article>
    )
}

export default MarkdownRenderer
