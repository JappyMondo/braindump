"use client";
import { WifiOff, Code, Eye, Download } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { ContentBlock } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import {
  CanvasToolbox,
  CanvasToolboxButton,
} from "@/components/canvas-toolbox";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface CanvasProps {
  content: string;
  blocks?: ContentBlock[];
  isProcessing?: boolean;
  isOffline?: boolean;
  className?: string;
  showRawMarkdown?: boolean;
  onToggleRawMarkdown?: () => void;
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
  onToggleRawMarkdown,
  title = "Untitled",
  isIdle = false,
}: CanvasProps) {
  const isMobile = useMediaQuery("(max-width: 990px)");

  // Function to download the content as a markdown file
  const handleDownload = () => {
    // Create a blob with the markdown content
    const blob = new Blob([content], { type: "text/markdown" });
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element
    const a = document.createElement("a");
    // Set the download filename using the document title
    const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    a.download = `${safeTitle}.md`;
    // Set the URL
    a.href = url;
    // Append to the document body
    document.body.appendChild(a);
    // Trigger the download
    a.click();
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show toast notification
    toast({
      title: "Download started",
      description: `${title}.md has been downloaded.`,
      duration: 3000,
    });
  };

  return (
    <div className={`relative flex flex-col h-full ${className}`}>
      {/* Status indicators - visible on hover at top right */}
      <CanvasToolbox
        position="top-right"
        isIdle={isIdle}
        className={
          isMobile ? "" : "opacity-0 hover:opacity-100 focus-within:opacity-100"
        }
      >
        {/* Offline indicator */}
        {isOffline && (
          <div className="flex items-center bg-amber-50/80 dark:bg-amber-900/50 backdrop-blur-sm text-amber-700 dark:text-amber-300 text-xs py-1 px-2 rounded">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </div>
        )}
      </CanvasToolbox>

      {/* Unified floating toolbox */}
      <CanvasToolbox position="bottom-right" isIdle={isIdle}>
        {/* Preview mode toggle button */}
        {onToggleRawMarkdown && (
          <CanvasToolboxButton
            onClick={onToggleRawMarkdown}
            icon={
              showRawMarkdown ? (
                <Eye className="h-4 w-4" />
              ) : (
                <Code className="h-4 w-4" />
              )
            }
            title={
              showRawMarkdown ? "Show rendered markdown" : "Show raw markdown"
            }
            label={isMobile ? (showRawMarkdown ? "View" : "Code") : undefined}
          />
        )}

        {/* Download button */}
        <CanvasToolboxButton
          onClick={handleDownload}
          icon={<Download className="h-4 w-4" />}
          title="Download as markdown"
          label={isMobile ? "Download" : undefined}
        />
      </CanvasToolbox>

      {/* Render raw markdown or the formatted markdown */}
      {showRawMarkdown ? (
        // Raw markdown display with syntax highlighting
        <div
          className={cn(
            "h-full overflow-auto text-sm font-mono whitespace-pre-wrap shadow-inner",
            isMobile ? "p-6 pt-16 pb-16" : "p-6"
          )}
        >
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
        <div
          className={cn(
            "h-full overflow-auto shadow-inner",
            isMobile ? "pt-16 pb-16" : ""
          )}
        >
          <Markdown content={content} blocks={blocks} />
        </div>
      )}
    </div>
  );
}
