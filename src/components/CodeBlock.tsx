// A simple component for displaying code blocks.
// In a real application, you would use a library like 'prism-react-renderer' or 'react-syntax-highlighter'
// for proper syntax highlighting. For this prototype, we'll use a simple <pre><code> block.

type CodeBlockProps = {
    code: string;
    language: string;
  };
  
export function CodeBlock({ code, language }: CodeBlockProps) {
return (
    <div className="bg-card p-4 rounded-md border text-sm overflow-x-auto">
        <pre><code className={`language-${language}`}>{code}</code></pre>
    </div>
);
}
