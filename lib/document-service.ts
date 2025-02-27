"use client";

import { supabase } from "@/lib/supabase";
import type { Document, ContentBlock, ProcessedDocument } from "@/lib/types";

export const documentService = {
  async getDocuments(userId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return [];
    }

    return data.map((doc) => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      processedContent: doc.processed_content || undefined,
      processedBlocks: (doc.processed_blocks as ContentBlock[]) || undefined,
      contentHash: doc.content_hash || undefined,
      createdAt: new Date(doc.created_at),
      updatedAt: new Date(doc.updated_at),
    }));
  },

  async getDocumentById(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching document:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      processedContent: data.processed_content || undefined,
      processedBlocks: (data.processed_blocks as ContentBlock[]) || undefined,
      contentHash: data.content_hash || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async createDocument(
    userId: string,
    document: Omit<Document, "id" | "createdAt" | "updatedAt">
  ): Promise<Document | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("documents")
      .insert({
        title: document.title,
        content: document.content,
        processed_content: document.processedContent || null,
        processed_blocks: document.processedBlocks || null,
        content_hash: document.contentHash || null,
        user_id: userId,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating document:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      processedContent: data.processed_content || undefined,
      processedBlocks: (data.processed_blocks as ContentBlock[]) || undefined,
      contentHash: data.content_hash || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async updateDocument(document: Document): Promise<Document | null> {
    const { data, error } = await supabase
      .from("documents")
      .update({
        title: document.title,
        content: document.content,
        processed_content: document.processedContent || null,
        processed_blocks: document.processedBlocks || null,
        content_hash: document.contentHash || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", document.id)
      .select()
      .single();

    if (error || !data) {
      console.error("Error updating document:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      processedContent: data.processed_content || undefined,
      processedBlocks: (data.processed_blocks as ContentBlock[]) || undefined,
      contentHash: data.content_hash || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async deleteDocument(id: string): Promise<boolean> {
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      console.error("Error deleting document:", error);
      return false;
    }

    return true;
  },

  async getLatestDocument(userId: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // If no documents exist, this is not an error
      if (error?.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching latest document:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      processedContent: data.processed_content || undefined,
      processedBlocks: (data.processed_blocks as ContentBlock[]) || undefined,
      contentHash: data.content_hash || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },
};
