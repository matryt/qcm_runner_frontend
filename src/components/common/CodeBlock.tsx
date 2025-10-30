import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps {
    code: string;
    language?: string | null;
}

// Register a few common languages lazily
SyntaxHighlighter.registerLanguage('ts', ts);
SyntaxHighlighter.registerLanguage('tsx', ts);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('xml', xml);

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const lang = (language || 'ts') as string;
    return (
        <SyntaxHighlighter language={lang} style={atomOneLight} customStyle={{ padding: '12px', overflowX: 'auto', margin: 0, textAlign: "left" }}>
            {code}
        </SyntaxHighlighter>
    );
};

export default CodeBlock;


