"use client";
import {
  Loader2,
  MoveHorizontal,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  WifiOff,
} from "lucide-react";
import { Markdown } from "@/components/markdown";
import { ContentBlock } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import {
  CanvasToolbox,
  CanvasToolboxButton,
} from "@/components/canvas-toolbox";

interface CanvasProps {
  content: string;
  blocks?: ContentBlock[];
  isProcessing?: boolean;
  isOffline?: boolean;
  className?: string;
  showRawMarkdown?: boolean;
  title?: string;
  isIdle?: boolean;
}

export function Canvas({
  content,
  blocks = [],
  isProcessing = false,
  isOffline = false,
  className = "",
  showRawMarkdown = false,
  title = "Untitled",
  isIdle = false,
}: CanvasProps) {
  return (
    <div className={`relative flex flex-col h-full ${className}`}>
      {/* Status indicators - visible on hover at top right */}
      <CanvasToolbox
        position="top-right"
        isIdle={isIdle}
        className="opacity-0 hover:opacity-100 focus-within:opacity-100"
      >
        {/* Offline indicator */}
        {isOffline && (
          <div className="flex items-center bg-amber-50/80 dark:bg-amber-900/50 backdrop-blur-sm text-amber-700 dark:text-amber-300 text-xs py-1 px-2 rounded">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </div>
        )}
      </CanvasToolbox>

      {/* Render raw markdown or the formatted markdown */}
      {showRawMarkdown ? (
        // Raw markdown display with syntax highlighting
        <div className="h-full overflow-auto p-6 text-sm font-mono whitespace-pre-wrap shadow-inner">
          {blocks.length > 0 ? (
            // Display blocks with syntax highlighting
            <div>
              {blocks.map((block, blockIndex) => (
                <div key={blockIndex} className="mb-4">
                  {/* Block type indicator */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {block.type.toUpperCase()}
                  </div>

                  {/* Block content with syntax highlighting */}
                  {block.type === "markdown" ? (
                    // Markdown block
                    <div>
                      {block.content.split("\n").map((line, lineIndex) => {
                        // Simple syntax highlighting for headings
                        if (line.startsWith("# ")) {
                          return (
                            <div
                              key={lineIndex}
                              className="text-blue-700 dark:text-blue-400 font-bold text-xl my-2"
                            >
                              {line}
                            </div>
                          );
                        }
                        if (line.startsWith("## ")) {
                          return (
                            <div
                              key={lineIndex}
                              className="text-blue-600 dark:text-blue-400 font-bold text-lg my-2"
                            >
                              {line}
                            </div>
                          );
                        }
                        if (line.startsWith("### ")) {
                          return (
                            <div
                              key={lineIndex}
                              className="text-blue-500 dark:text-blue-400 font-bold my-2"
                            >
                              {line}
                            </div>
                          );
                        }

                        // List items
                        if (line.match(/^[*\-+] /)) {
                          return (
                            <div
                              key={lineIndex}
                              className="text-purple-600 dark:text-purple-400"
                            >
                              {line}
                            </div>
                          );
                        }
                        if (line.match(/^\d+\. /)) {
                          return (
                            <div
                              key={lineIndex}
                              className="text-purple-600 dark:text-purple-400"
                            >
                              {line}
                            </div>
                          );
                        }

                        // Default
                        return <div key={lineIndex}>{line}</div>;
                      })}
                    </div>
                  ) : (
                    // Mermaid block
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="text-green-600 dark:text-green-400 font-bold mb-2">
                        ```mermaid
                      </div>
                      <div>
                        {block.content.split("\n").map((line, lineIndex) => (
                          <div
                            key={lineIndex}
                            className="text-green-700 dark:text-green-500"
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                      <div className="text-green-600 dark:text-green-400 font-bold mt-2">
                        ```
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Fallback to original content if no blocks are provided
            <div>
              {content.split("\n").map((line, index) => {
                // Simple syntax highlighting for headings
                if (line.startsWith("# ")) {
                  return (
                    <div
                      key={index}
                      className="text-blue-700 dark:text-blue-400 font-bold text-xl my-2"
                    >
                      {line}
                    </div>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <div
                      key={index}
                      className="text-blue-600 dark:text-blue-400 font-bold text-lg my-2"
                    >
                      {line}
                    </div>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <div
                      key={index}
                      className="text-blue-500 dark:text-blue-400 font-bold my-2"
                    >
                      {line}
                    </div>
                  );
                }

                // List items
                if (line.match(/^[*\-+] /)) {
                  return (
                    <div
                      key={index}
                      className="text-purple-600 dark:text-purple-400"
                    >
                      {line}
                    </div>
                  );
                }
                if (line.match(/^\d+\. /)) {
                  return (
                    <div
                      key={index}
                      className="text-purple-600 dark:text-purple-400"
                    >
                      {line}
                    </div>
                  );
                }

                // Code blocks
                if (line.startsWith("```")) {
                  return (
                    <div
                      key={index}
                      className="text-red-500 dark:text-red-400 font-bold"
                    >
                      {line}
                    </div>
                  );
                }

                // Detect mermaid code blocks and give them special formatting
                if (line.includes("mermaid") && line.includes("```")) {
                  return (
                    <div
                      key={index}
                      className="text-green-600 dark:text-green-400 font-bold"
                    >
                      {line}
                    </div>
                  );
                }

                // Default
                return <div key={index}>{line}</div>;
              })}
            </div>
          )}
        </div>
      ) : (
        // Rendered markdown with the Markdown component
        <div className="h-full overflow-auto shadow-inner">
          <Markdown content={content} blocks={blocks} />
        </div>
      )}
    </div>
  );
}
