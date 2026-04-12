import React, { useMemo } from 'react';
import katex from 'katex';

type MathToken = {
    type: 'text' | 'inline' | 'block';
    value: string;
};

const tokenizeMath = (text: string): MathToken[] => {
    const tokens: MathToken[] = [];
    let buffer = '';
    let i = 0;

    const flushBuffer = () => {
        if (buffer.length > 0) {
            tokens.push({ type: 'text', value: buffer });
            buffer = '';
        }
    };

    while (i < text.length) {
        if (text[i] === '\\' && text[i + 1] === '$') {
            buffer += '$';
            i += 2;
            continue;
        }

        if (text[i] !== '$') {
            buffer += text[i];
            i += 1;
            continue;
        }

        const isBlock = text[i + 1] === '$';
        const delimiterLength = isBlock ? 2 : 1;
        let cursor = i + delimiterLength;
        let closingIndex = -1;

        while (cursor < text.length) {
            if (text[cursor] === '\\') {
                cursor += 2;
                continue;
            }

            if (isBlock) {
                if (text[cursor] === '$' && text[cursor + 1] === '$') {
                    closingIndex = cursor;
                    break;
                }
            } else if (text[cursor] === '$' && text[cursor + 1] !== '$') {
                closingIndex = cursor;
                break;
            }

            cursor += 1;
        }

        if (closingIndex === -1) {
            buffer += text.slice(i, i + delimiterLength);
            i += delimiterLength;
            continue;
        }

        flushBuffer();
        const rawExpression = text.slice(i + delimiterLength, closingIndex).trim();

        if (rawExpression.length === 0) {
            buffer += text.slice(i, closingIndex + delimiterLength);
            i = closingIndex + delimiterLength;
            continue;
        }

        tokens.push({
            type: isBlock ? 'block' : 'inline',
            value: rawExpression,
        });

        i = closingIndex + delimiterLength;
    }

    flushBuffer();
    return tokens;
};

interface MathTextProps {
    text: string;
}

interface KatexNodeProps {
    math: string;
    displayMode: boolean;
    fallback: string;
}

const KatexNode: React.FC<KatexNodeProps> = ({ math, displayMode, fallback }) => {
    const renderedHtml = useMemo(() => {
        try {
            return katex.renderToString(math, {
                displayMode,
                throwOnError: false,
                strict: 'warn',
                trust: false,
            });
        } catch {
            return null;
        }
    }, [math, displayMode]);

    if (!renderedHtml) {
        return <>{fallback}</>;
    }

    return <span dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};

const MathText: React.FC<MathTextProps> = ({ text }) => {
    const tokens = tokenizeMath(text);

    return (
        <>
            {tokens.map((token, index) => {
                if (token.type === 'text') {
                    return <React.Fragment key={`text-${index}`}>{token.value}</React.Fragment>;
                }

                if (token.type === 'block') {
                    return (
                        <span key={`block-${index}`} className="math-block">
                            <KatexNode
                                math={token.value}
                                displayMode={true}
                                fallback={`$$${token.value}$$`}
                            />
                        </span>
                    );
                }

                return (
                    <span key={`inline-${index}`} className="math-inline">
                        <KatexNode
                            math={token.value}
                            displayMode={false}
                            fallback={`$${token.value}$`}
                        />
                    </span>
                );
            })}
        </>
    );
};

export default MathText;