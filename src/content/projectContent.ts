
const markdownFiles = import.meta.glob<string>(
    './projects/*.md',
    {
    query: '?raw',
    import: 'default',
    eager: true,
    }
)

export function getProjectContent(
    id: string
): string | undefined {
    return markdownFiles[`./projects/${id}.md`]
}
