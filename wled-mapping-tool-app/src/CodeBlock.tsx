import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    children: string;
    language?: string;
    downloadHandler: () => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'typescript', downloadHandler }) => {
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset the "Copied!" message after 2 seconds
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleDownloaded = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setDownloaded(true)
            downloadHandler()
            setTimeout(() => setDownloaded(false), 2000); // Reset the "Downloaded!" message after 2 seconds
        } catch (error) {
            console.error('Failed to download:', error);
        }
    };


    return (
        <div style={{ position: 'relative', width: '100%' }}>

            <div
                style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: '#282a36',
                    color: '#f8f8f2',
                }}
            >
                <SyntaxHighlighter language={language} style={dracula}>
                    {children}
                </SyntaxHighlighter>

                <div className='flex flex-row'>
                    <button
                        className='btn btn-primary'
                        onClick={handleCopy}
                        style={{

                            backgroundColor: copied ? '#4caf50' : '#007bff',

                        }}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        className='button downloadButton'
                        onClick={handleDownloaded}
                        style={{

                            backgroundColor: downloaded ? '#4caf50' : '#007bff',

                        }}
                    >
                        {downloaded ? 'Downloaded!' : 'Download'}
                    </button>
                </div>
            </div>
            <DaisyUiButtons></DaisyUiButtons>
        </div>
    );
};

const DaisyUiButtons: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        setTheme(newTheme);
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-10">
            <h1 className="text-2xl font-bold">DaisyUI Buttons</h1>
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-accent">Accent Button</button>
            <button className="btn btn-outline">Outline Button</button>
            <button className="btn btn-ghost">Ghost Button</button>
            <button className="btn btn-error">Error Button</button>
            <button onClick={toggleTheme} className="btn btn-info">
                Toggle Theme ({theme === 'light' ? 'Switch to Dark' : 'Switch to Light'})
            </button>
        </div>
    );
};

export default CodeBlock;
