export interface Document {
  id: string;
  title: string;
  content: string;
  processedContent?: string;
  processedBlocks?: ContentBlock[];
  contentHash?: string; // Hash to track content state for AI processing
  createdAt: Date;
  updatedAt: Date;
}

// New types for AI-processed content
export interface ContentBlock {
  type: "markdown" | "mermaid";
  content: string;
}

export interface ProcessedDocument {
  title: string;
  content: string; // This is the joined string of all content blocks
  blocks: ContentBlock[]; // The original blocks before joining
}
