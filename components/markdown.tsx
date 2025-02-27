"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import { ContentBlock } from "@/lib/types";

interface MarkdownProps {
  content: string;
  blocks?: ContentBlock[];
}

export function Markdown({ content, blocks = [] }: MarkdownProps) {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState(0); // Add key to force re-render
  const mermaidInitialized = useRef(false);

  // Function to initialize mermaid
  const initializeMermaid = useCallback(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains("dark")
        ? "dark"
        : "default",
      securityLevel: "loose",
      fontFamily: "inherit",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
      },
    });
    mermaidInitialized.current = true;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize mermaid when component mounts
  useEffect(() => {
    if (!mermaidInitialized.current) {
      initializeMermaid();
    }

    // Re-render mermaid diagrams when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          document.documentElement.classList.contains("dark") !==
            (mermaid.mermaidAPI.getConfig().theme === "dark")
        ) {
          initializeMermaid();
          // Force re-render
          setKey((prevKey) => prevKey + 1);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [initializeMermaid]);

  // Process and render mermaid diagrams after the component has rendered
  useEffect(() => {
    if (mounted) {
      // Use a timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        try {
          const mermaidDivs = document.querySelectorAll(".mermaid");
          if (mermaidDivs.length > 0) {
            mermaid.run();
          }
        } catch (err) {
          console.error("Mermaid processing error:", err);
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [mounted, content, key]);

  // Force re-render when content changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [content, blocks]);

  if (!mounted) {
    return null;
  }

  // If we have blocks, render them directly
  if (blocks.length > 0) {
    return (
      <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none p-6 rounded-md">
        {blocks.map((block, index) => {
          if (block.type === "markdown") {
            // Render markdown block
            return (
              <ReactMarkdown
                key={`${index}-${key}`}
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom components with enhanced styling
                  h1: (props) => (
                    <h1
                      className="text-3xl font-bold mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 dark:text-white"
                      {...props}
                    />
                  ),
                  h2: (props) => (
                    <h2
                      className="text-2xl font-bold mt-5 mb-3 dark:text-white"
                      {...props}
                    />
                  ),
                  h3: (props) => (
                    <h3
                      className="text-xl font-bold mt-4 mb-2 dark:text-white"
                      {...props}
                    />
                  ),
                  h4: (props) => (
                    <h4
                      className="text-lg font-semibold mt-3 mb-2 dark:text-gray-100"
                      {...props}
                    />
                  ),
                  ul: (props) => (
                    <ul
                      className="list-disc pl-6 mb-4 dark:text-gray-200"
                      {...props}
                    />
                  ),
                  ol: (props) => (
                    <ol
                      className="list-decimal pl-6 mb-4 dark:text-gray-200"
                      {...props}
                    />
                  ),
                  li: (props) => (
                    <li className="mb-1 dark:text-gray-200" {...props} />
                  ),
                  a: (props) => (
                    <a
                      className="text-blue-600 hover:underline dark:text-blue-400"
                      {...props}
                    />
                  ),
                  strong: (props) => (
                    <strong
                      className="font-bold dark:text-gray-100"
                      {...props}
                    />
                  ),
                  blockquote: (props) => (
                    <blockquote
                      className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 my-4 bg-gray-50 dark:bg-gray-800 py-2 px-2 rounded"
                      {...props}
                    />
                  ),
                  pre: (props) => (
                    <pre
                      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-4 overflow-auto border border-gray-200 dark:border-gray-700"
                      {...props}
                    />
                  ),
                  code: (props) => {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !className;

                    if (isInline) {
                      return (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200"
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    }

                    return (
                      <code
                        className={`block bg-gray-100 dark:bg-gray-800 p-4 rounded my-4 text-sm font-mono overflow-auto text-gray-800 dark:text-gray-200 ${
                          match ? `language-${match[1]}` : ""
                        }`}
                        {...rest}
                      >
                        {children}
                      </code>
                    );
                  },
                  img: (props) => (
                    <img
                      className="max-w-full h-auto rounded my-4 dark:border dark:border-gray-700"
                      {...props}
                    />
                  ),
                  p: (props) => (
                    <p className="mb-4 dark:text-gray-200" {...props} />
                  ),
                  hr: () => (
                    <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />
                  ),
                  table: (props) => (
                    <div className="overflow-x-auto my-4">
                      <table
                        className="border-collapse table-auto w-full border border-gray-300 dark:border-gray-700"
                        {...props}
                      />
                    </div>
                  ),
                  th: (props) => (
                    <th
                      className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
                      {...props}
                    />
                  ),
                  td: (props) => (
                    <td
                      className="border border-gray-300 dark:border-gray-700 px-4 py-2 dark:text-gray-300"
                      {...props}
                    />
                  ),
                }}
              >
                {block.content}
              </ReactMarkdown>
            );
          } else if (block.type === "mermaid") {
            // Render mermaid block directly
            return (
              <div key={`mermaid-${index}-${key}`} className="my-6">
                <div className="mermaid my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded overflow-auto text-center">
                  {block.content}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Use the original rendering approach if no blocks are provided
  return (
    <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none p-6 rounded-md">
      <ReactMarkdown
        key={key} // Use key to force re-render
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom components with enhanced styling
          h1: (props) => (
            <h1
              className="text-3xl font-bold mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 dark:text-white"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-2xl font-bold mt-5 mb-3 dark:text-white"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-xl font-bold mt-4 mb-2 dark:text-white"
              {...props}
            />
          ),
          h4: (props) => (
            <h4
              className="text-lg font-semibold mt-3 mb-2 dark:text-gray-100"
              {...props}
            />
          ),
          ul: (props) => (
            <ul className="list-disc pl-6 mb-4 dark:text-gray-200" {...props} />
          ),
          ol: (props) => (
            <ol
              className="list-decimal pl-6 mb-4 dark:text-gray-200"
              {...props}
            />
          ),
          li: (props) => <li className="mb-1 dark:text-gray-200" {...props} />,
          a: (props) => (
            <a
              className="text-blue-600 hover:underline dark:text-blue-400"
              {...props}
            />
          ),
          strong: (props) => (
            <strong className="font-bold dark:text-gray-100" {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 my-4 bg-gray-50 dark:bg-gray-800 py-2 px-2 rounded"
              {...props}
            />
          ),
          pre: ({ node, ...props }) => {
            // @ts-ignore
            const value = node?.children[0]?.children[0]?.value || "";

            // Check if it's a mermaid code block - includes both language-mermaid class and common mermaid syntax
            const isMermaidCodeBlock =
              // @ts-ignore
              (node?.children[0]?.properties?.className || []).includes(
                "language-mermaid"
              ) ||
              (typeof value === "string" &&
                (value.trim().startsWith("graph") ||
                  value.trim().startsWith("flowchart") ||
                  value.trim().startsWith("sequenceDiagram") ||
                  value.trim().startsWith("classDiagram") ||
                  value.trim().startsWith("gantt") ||
                  value.trim().startsWith("pie") ||
                  value.trim().startsWith("erDiagram") ||
                  value.trim().startsWith("stateDiagram")));

            if (isMermaidCodeBlock) {
              return (
                <div className="mermaid my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded overflow-auto text-center">
                  {value}
                </div>
              );
            }

            // Regular pre block
            return (
              <pre
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-4 overflow-auto border border-gray-200 dark:border-gray-700"
                {...props}
              />
            );
          },
          code: (props) => {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !className;

            // Check if it's a mermaid code block
            if (match && match[1] === "mermaid") {
              return (
                <div className="mermaid my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded overflow-auto text-center">
                  {children}
                </div>
              );
            }

            if (isInline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className={`block bg-gray-100 dark:bg-gray-800 p-4 rounded my-4 text-sm font-mono overflow-auto text-gray-800 dark:text-gray-200 ${
                  match ? `language-${match[1]}` : ""
                }`}
                {...rest}
              >
                {children}
              </code>
            );
          },
          img: (props) => (
            <img
              className="max-w-full h-auto rounded my-4 dark:border dark:border-gray-700"
              {...props}
            />
          ),
          p: (props) => <p className="mb-4 dark:text-gray-200" {...props} />,
          hr: () => (
            <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />
          ),
          table: (props) => (
            <div className="overflow-x-auto my-4">
              <table
                className="border-collapse table-auto w-full border border-gray-300 dark:border-gray-700"
                {...props}
              />
            </div>
          ),
          th: (props) => (
            <th
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 dark:text-gray-300"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
