
import React, { useState } from "react";
import { Check, Clipboard, Code } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 bg-slate-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
        <div className="flex items-center">
          <Code className="h-4 w-4 text-slate-400 mr-2" />
          <span className="text-xs text-slate-400">{language}</span>
        </div>
        <button 
          onClick={handleCopy} 
          className="hover:bg-slate-700 p-1 rounded"
        >
          {copied ? (
            <Check className="h-4 w-4 text-wonder-green" />
          ) : (
            <Clipboard className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
