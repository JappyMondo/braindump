"use client";

import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor";
import { Canvas } from "@/components/canvas";
import { DocumentManager } from "@/components/document-manager";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMouseIdle } from "@/hooks/use-mouse-idle";
import { useDocuments } from "@/lib/hooks/use-documents";
import debounce from "lodash/debounce";
import { AlertCircle, FilePlus, LogOut, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useAuth } from "@/lib/auth-context";
import { processContent } from "@/lib/ai";
import {
  CanvasToolbox,
  CanvasToolboxButton,
} from "@/components/canvas-toolbox";
import { ToolboxThemeToggle } from "@/components/toolbox-theme-toggle";
import { ToolboxLayoutToggle } from "@/components/toolbox-layout-toggle";

export default function BraindumpApp() {
  const {
    documents,
    activeDoc,
    isLoading: isLoadingDocs,
    error: docsError,
    selectDocument,
    createDocument,
    updateDocument,
    deleteDocument,
  } = useDocuments();

  const [showEditor, setShowEditor] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isProcessing, setIsProcessing] = useState(false);
  const isIdle = useMouseIdle(2000); // 2 seconds of no mouse movement
  const [editorSize, setEditorSize] = useState(50);
  const [previewSize, setPreviewSize] = useState(50);
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);
  const { signOut } = useAuth();
  const [editorContent, setEditorContent] = useState("");
  const [lastActiveDocId, setLastActiveDocId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load panel sizes from localStorage
  useEffect(() => {
    const savedEditorSize = localStorage.getItem("editorSize");
    const savedPreviewSize = localStorage.getItem("previewSize");

    if (savedEditorSize) setEditorSize(Number(savedEditorSize));
    if (savedPreviewSize) setPreviewSize(Number(savedPreviewSize));
  }, [setEditorSize, setPreviewSize]);

  // Save panel sizes when they change
  const handlePanelResize = (sizes: number[]) => {
    if (sizes.length >= 2) {
      localStorage.setItem("editorSize", sizes[0].toString());
      localStorage.setItem("previewSize", sizes[1].toString());
      setEditorSize(sizes[0]);
      setPreviewSize(sizes[1]);
    }
  };

  const transformWithAi = useCallback(async () => {
    try {
      // Get the current active document from the ref
      const currentActiveDoc = activeDocRef.current;

      if (!currentActiveDoc) {
        console.log(
          "[BraindumpApp] No active document in transformWithAi, skipping AI processing"
        );
        return;
      }

      if (currentActiveDoc.content?.length < 110) {
        console.log(
          "[BraindumpApp] Document content is too short, skipping AI processing"
        );
        return;
      }

      // Generate a simple hash of the content
      const contentHash = await generateContentHash(currentActiveDoc.content);

      // Only process if the hash has changed
      if (contentHash === currentActiveDoc.contentHash) {
        console.log(
          "[BraindumpApp] Skipping AI processing - content unchanged (hash match)"
        );
        return;
      }

      setIsProcessing(true);
      console.log(
        "[BraindumpApp] Starting AI processing for document:",
        currentActiveDoc.id
      );
      const transformedContent = await processContent(currentActiveDoc.content);

      console.log("[BraindumpApp] Updating document with processed content", {
        docId: currentActiveDoc.id,
        contentLength: currentActiveDoc.content.length,
        processedContentLength: transformedContent.content.length,
        blocksCount: transformedContent.blocks.length,
      });

      const result = await updateDocument({
        ...currentActiveDoc,
        processedContent: transformedContent.content,
        title: transformedContent.title,
        processedBlocks: transformedContent.blocks,
        contentHash: contentHash, // Store the hash with the processed result
      });

      console.log(
        "[BraindumpApp] Document update after AI processing result:",
        {
          success: !!result,
          title: result?.title,
          processedContentUpdated:
            !!result?.processedContent && result.processedContent.length > 0,
          processedContentLength: result?.processedContent?.length || 0,
        }
      );
    } catch (error) {
      console.error("Error transforming document:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [updateDocument]);

  // Helper function to generate a simple hash
  const generateContentHash = async (content: string): Promise<string> => {
    // Use the Web Crypto API to create a hash
    const msgUint8 = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  // Store debounced functions in refs to prevent recreation
  const updateContentDebouncedRef = useRef<Function | null>(null);
  const transformWithAiDebouncedRef = useRef<Function | null>(null);

  // Store latest state values in refs to avoid closure issues
  const activeDocRef = useRef(activeDoc);
  const editorContentRef = useRef(editorContent);

  // Keep refs updated with latest values
  useEffect(() => {
    activeDocRef.current = activeDoc;
  }, [activeDoc]);

  useEffect(() => {
    editorContentRef.current = editorContent;
  }, [editorContent]);

  // Setup debounced functions once on component mount
  useEffect(() => {
    console.log("[BraindumpApp] Setting up debounced functions");

    // Content update debounce
    updateContentDebouncedRef.current = debounce(async () => {
      // Use ref values for latest state
      const currentActiveDoc = activeDocRef.current;
      const currentEditorContent = editorContentRef.current;

      console.log("[BraindumpApp] updateContentDebounced triggered", {
        hasActiveDoc: !!currentActiveDoc,
        activeDocId: currentActiveDoc?.id,
        editorContentLength: currentEditorContent.length,
      });

      if (!currentActiveDoc) return;

      // Create updated document with new content
      const updatedDoc = {
        ...currentActiveDoc,
        content: currentEditorContent,
        updatedAt: new Date(),
      };

      console.log("[BraindumpApp] updating document", {
        id: updatedDoc.id,
        contentPreview: updatedDoc.content.substring(0, 20) + "...",
        contentLength: updatedDoc.content.length,
      });

      // Use the hook's updateDocument function
      try {
        setIsSaving(true);
        const result = await updateDocument(updatedDoc);
        console.log("[BraindumpApp] document update result", {
          success: !!result,
          id: result?.id,
          resultContentLength: result?.content?.length || 0,
        });
      } catch (error) {
        console.error("[BraindumpApp] Error updating document:", error);
      } finally {
        setIsSaving(false);
      }
    }, 300);

    // AI transform debounce
    transformWithAiDebouncedRef.current = debounce(() => {
      console.log("[BraindumpApp] debouncedTransformWithAi triggered");
      const currentActiveDoc = activeDocRef.current;
      if (!currentActiveDoc) {
        console.log(
          "[BraindumpApp] No active document in ref, skipping AI processing"
        );
        return;
      }
      setIsProcessing(true);
      transformWithAi();
    }, 1000);

    // Cleanup
    return () => {
      if (updateContentDebouncedRef.current) {
        // @ts-ignore - TypeScript doesn't know about the cancel method on debounced functions
        (updateContentDebouncedRef.current as any).cancel();
      }
      if (transformWithAiDebouncedRef.current) {
        // @ts-ignore
        (transformWithAiDebouncedRef.current as any).cancel();
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Simple wrappers for the debounced functions
  const updateContentDebounced = useCallback(() => {
    if (updateContentDebouncedRef.current) {
      (updateContentDebouncedRef.current as Function)();
    }
  }, []);

  const debouncedTransformWithAi = useCallback(() => {
    if (transformWithAiDebouncedRef.current) {
      (transformWithAiDebouncedRef.current as Function)();
    }
  }, []);

  const handleEditorChange = useCallback(
    (content: string) => {
      console.log("[BraindumpApp] handleEditorChange called", {
        contentLength: content.length,
        preview: content.substring(0, 20) + "...",
        currentContentLength: editorContent.length,
      });

      // Only update if content actually changed
      if (content === editorContent) {
        console.log("[BraindumpApp] content unchanged, skipping update");
        return; // Add return to stop execution if content hasn't changed
      }

      console.log(
        "[BraindumpApp] content changed, updating state and triggering save"
      );

      // Calculate the magnitude of the change
      const changeSize = Math.abs(content.length - editorContent.length);
      const isSignificantChange = changeSize >= 10;

      setEditorContent(content);
      updateContentDebounced();

      // Only trigger AI processing for significant changes
      if (isSignificantChange) {
        console.log(
          "[BraindumpApp] Significant content change detected, scheduling AI processing"
        );
        debouncedTransformWithAi();
      } else {
        console.log(
          "[BraindumpApp] Minor content change, skipping AI processing"
        );
      }
    },
    [updateContentDebounced, debouncedTransformWithAi, editorContent] // Need editorContent here for comparison
  );

  useEffect(() => {
    if (activeDoc?.id !== lastActiveDocId) {
      setEditorContent(activeDoc?.content ?? "");
      setLastActiveDocId(activeDoc?.id ?? null);

      // When switching to a new document that has content but no hash,
      // generate and save the hash to prevent unnecessary AI processing
      const initializeContentHash = async () => {
        // Get the current document from the ref to avoid stale closure
        const currentDoc = activeDocRef.current;

        // Make sure we're still dealing with the same document
        if (
          currentDoc &&
          currentDoc.id === activeDoc?.id &&
          currentDoc.content &&
          !currentDoc.contentHash
        ) {
          try {
            console.log(
              "[BraindumpApp] Initializing content hash for document",
              currentDoc.id
            );
            const hash = await generateContentHash(currentDoc.content);

            // Check again that we're still on the same document before updating
            if (currentDoc.id === activeDocRef.current?.id) {
              // Update the document with the hash only (no AI processing)
              updateDocument({
                ...currentDoc,
                contentHash: hash,
              });
              console.log(
                "[BraindumpApp] Content hash initialized successfully"
              );
            } else {
              console.log(
                "[BraindumpApp] Document changed during hash initialization, skipping update"
              );
            }
          } catch (error) {
            console.error(
              "[BraindumpApp] Error initializing content hash:",
              error
            );
          }
        }
      };

      initializeContentHash();
    }
  }, [activeDoc, lastActiveDocId, updateDocument]);

  const deleteActiveDocument = useCallback(async () => {
    if (activeDoc) {
      await deleteDocument(activeDoc.id);
    }
  }, [activeDoc, deleteDocument]);

  // UI should be disabled if there's an error loading documents
  const isUIDisabled = useMemo(() => !!docsError, [docsError]);

  // Toggle raw markdown view
  const toggleRawMarkdown = useCallback(() => {
    setShowRawMarkdown((prev) => !prev);
  }, []);

  const EditorMemo = useMemo(() => {
    console.log(
      "[BraindumpApp] Creating EditorMemo with content length:",
      editorContent.length
    );
    return <Editor value={editorContent} onChange={handleEditorChange} />;
  }, [editorContent, handleEditorChange]);

  const CanvasMemo = useMemo(() => {
    const displayContent = showRawMarkdown
      ? activeDoc?.content
      : activeDoc?.processedContent;
    console.log("[BraindumpApp] Creating CanvasMemo component", {
      hasActiveDoc: !!activeDoc,
      contentLength: displayContent?.length || 0,
      hasProcessedContent: !!activeDoc?.processedContent,
      processedContentLength: activeDoc?.processedContent?.length || 0,
      showingRawMarkdown: showRawMarkdown,
    });

    return (
      <Canvas
        blocks={activeDoc?.processedBlocks || []}
        content={displayContent ?? ""}
        isProcessing={isProcessing}
        showRawMarkdown={showRawMarkdown}
        onToggleRawMarkdown={toggleRawMarkdown}
        title={activeDoc?.title || "Untitled"}
        isIdle={isIdle}
      />
    );
  }, [activeDoc, showRawMarkdown, isProcessing, toggleRawMarkdown, isIdle]);

  return (
    <div className="h-screen w-full bg-background flex flex-col relative">
      {/* Loading Overlay */}
      {isLoadingDocs && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium">Loading your documents...</p>
        </div>
      )}

      {/* Error Message */}
      {docsError && (
        <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center z-50 p-4">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-lg text-center mb-6 max-w-md">{docsError}</p>
          <Button onClick={() => window.location.reload()} size="lg">
            Refresh the page
          </Button>
        </div>
      )}

      <main
        className={`flex-1 relative overflow-hidden ${
          isUIDisabled ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {/* Status indicators - floating at the top center */}
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 transition-all duration-300 ${
            editorContent !== activeDoc?.content || isProcessing || isSaving
              ? "opacity-90"
              : "opacity-0"
          }`}
        >
          {editorContent !== activeDoc?.content && !isProcessing && (
            <div className="flex items-center bg-amber-50/80 dark:bg-amber-900/50 backdrop-blur-sm text-amber-700 dark:text-amber-300 text-xs py-1 px-2 rounded">
              Edited
            </div>
          )}
          {isSaving && (
            <div className="flex items-center bg-green-50/80 dark:bg-green-900/50 backdrop-blur-sm text-green-700 dark:text-green-300 text-xs py-1 px-2 rounded">
              Saved
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center gap-1 bg-blue-50/80 dark:bg-blue-900/50 backdrop-blur-sm text-blue-700 dark:text-blue-300 text-xs py-1 px-2 rounded">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing
            </div>
          )}
        </div>

        {/* Floating document manager - moved to bottom left */}
        <CanvasToolbox position="bottom-left" isIdle={isIdle}>
          <DocumentManager
            documents={documents}
            activeDoc={activeDoc}
            onDocumentSelect={selectDocument}
            isLoading={isLoadingDocs}
          />
          <CanvasToolboxButton
            onClick={createDocument}
            icon={<FilePlus className="h-4 w-4" />}
            title="New Document"
            className="ml-1"
          />
        </CanvasToolbox>

        {/* Floating actions toolbox - moved to bottom middle */}
        <CanvasToolbox position="bottom-center" isIdle={isIdle}>
          {isMobile && (
            <ToolboxLayoutToggle value={showEditor} onChange={setShowEditor} />
          )}
          <ToolboxThemeToggle />
          <CanvasToolboxButton
            onClick={signOut}
            icon={<LogOut className="h-4 w-4" />}
            title="Sign Out"
          />
        </CanvasToolbox>

        {/* Main content area - removed top padding for full height */}
        <div className="w-full h-full">
          {isMobile ? (
            showEditor ? (
              EditorMemo
            ) : (
              CanvasMemo
            )
          ) : (
            <ResizablePanelGroup
              direction="horizontal"
              onLayout={handlePanelResize}
              className="h-full"
            >
              <ResizablePanel defaultSize={editorSize} minSize={20}>
                {EditorMemo}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={previewSize} minSize={20}>
                {CanvasMemo}
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </main>
    </div>
  );
}
