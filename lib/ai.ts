"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { LoadAPIKeyError } from "ai";
import { z } from "zod";
import { ProcessedDocument, ContentBlock } from "@/lib/types";

// Helper to check if we have required environment variables
const hasRequiredEnvVars = () => {
  const doesHave = Boolean(process.env.OPENAI_API_KEY);
  return doesHave;
};

// Configure the AI model based on environment
const getModel = () => {
  if (!hasRequiredEnvVars()) {
    throw new LoadAPIKeyError({ message: "Missing required API key" });
  }
  return openai(process.env.AI_MODEL || "gpt-4o-2024-08-06");
};

export async function processContent(
  content: string
): Promise<ProcessedDocument> {
  if (!hasRequiredEnvVars()) {
    return {
      title: "Untitled",
      content: content,
      blocks: [{ type: "markdown", content }],
    };
  }

  try {
    const blockSchema = z.object({
      type: z.enum(["markdown", "mermaid"]),
      content: z.string().describe("The content of the block"),
    });
    const documentSchema = z
      .object({
        title: z
          .string()
          .describe(
            "The title of the document, should be a concise and descriptive title for the content"
          ),
        content: z
          .array(blockSchema)
          .describe(
            "The content of the document, split into blocks of different types"
          ),
      })
      .describe("A well-structured markdown document with mermaid diagrams");

    const { object } = await generateObject({
      model: getModel(),
      schema: documentSchema,
      system:
        "You are a helpful assistant that organizes brainstorming notes into clear, structured documents. Use markdown formatting. Create mermaid diagrams when appropriate to visualize relationships or processes. Keep the original content's meaning but improve its structure and clarity.",
      prompt: `Transform this brainstorming content into a well-structured markdown document with 
      sections, 
      diagrams (using mermaid, make sure you use correct mermaid syntax), 
      and ensure the language used in the document matches the language of the original notes,
      and key points:\n\n${content}`,
    });

    console.log("Generated object:", object);

    // Convert the response to our ProcessedDocument format
    const blocks = object.content as ContentBlock[];

    // Join blocks into a single content string
    const joinedContent = blocks
      .map((block) => {
        switch (block.type) {
          case "markdown":
            return block.content;
          case "mermaid":
            return `\`\`\`mermaid\n${block.content}\n\`\`\``;
        }
      })
      .join("\n\n");

    return {
      title: object.title,
      content: joinedContent,
      blocks,
    };
  } catch (error) {
    console.error("Failed to process content:", error);
    return {
      title: "Untitled",
      content: content,
      blocks: [{ type: "markdown", content }],
    };
  }
}
