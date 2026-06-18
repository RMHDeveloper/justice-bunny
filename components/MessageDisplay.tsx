import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface MessageDisplayProps {
  message: Message;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-3/4 p-4 rounded-xl shadow-md ${
          isUser
            ? 'bg-[#1A2B48] text-white mr-2'
            : 'bg-white text-[#1A2B48] ml-2 border border-slate-200'
        }`}
      >
        {isUser ? (
          <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm md:prose-base max-w-none text-[#1A2B48]"
            components={{
              h1: ({ children, ...props }) => <h1 className="text-xl font-bold mb-2" {...props}>{children}</h1>,
              h2: ({ children, ...props }) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props}>{children}</h2>,
              h3: ({ children, ...props }) => <h3 className="text-base font-medium mt-3 mb-1" {...props}>{children}</h3>,
              p: ({ children, ...props }) => <p className="mb-2 text-sm md:text-base" {...props}>{children}</p>,
              ul: ({ children, ...props }) => <ul className="list-disc list-inside mb-2 pl-4" {...props}>{children}</ul>,
              ol: ({ children, ...props }) => <ol className="list-decimal list-inside mb-2 pl-4" {...props}>{children}</ol>,
              li: ({ children, ...props }) => <li className="mb-1 text-sm md:text-base" {...props}>{children}</li>,
              a: ({ children, ...props }) => <a className="text-[#1A2B48] hover:underline font-medium" {...props}>{children}</a>,
              strong: ({children, ...props}) => <strong className="font-bold" {...props}>{children}</strong>,
              em: ({children, ...props}) => <em className="italic" {...props}>{children}</em>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};