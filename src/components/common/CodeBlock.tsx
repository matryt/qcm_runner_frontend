import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './CodeBlock.css';

interface CodeBlockProps {
    code: string;
    language?: string | null;
}

// Enregistrement des langages
SyntaxHighlighter.registerLanguage('ts', ts);
SyntaxHighlighter.registerLanguage('tsx', ts);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('xml', xml);

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);
    const lang = (language || 'ts') as string;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erreur lors de la copie du code :', err);
        }
    };

    return (
        <div className="code-block-container">
            <div className="code-block-header">
                <span className="code-language-tag">{lang}</span>
                <button
                    type="button"
                    className={`copy-code-button ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    aria-label="Copier le code"
                >
                    {copied ? (
                        <>
                            <span className="copy-icon">✓</span>
                            <span>Copié !</span>
                        </>
                    ) : (
                        <>
                            <span className="copy-icon">📋</span>
                            <span>Copier</span>
                        </>
                    )}
                </button>
            </div>

            <SyntaxHighlighter
                language={lang}
                style={atomOneLight}
                customStyle={{
                    padding: '16px',
                    margin: 0,
                    textAlign: 'left',
                    fontSize: '0.9em',
                    backgroundColor: '#fafbfc'
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;