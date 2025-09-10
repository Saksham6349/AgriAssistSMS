// A simple component for displaying formatted code blocks.
// Note: This does not include syntax highlighting.
interface CodeBlockProps {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    return (
        <div className="bg-muted rounded-md border p-4 text-sm text-muted-foreground overflow-x-auto">
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    );
}
