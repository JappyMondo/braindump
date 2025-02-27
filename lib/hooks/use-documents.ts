"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { documentService } from "@/lib/document-service";
import type { Document } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Use refs to track initialization state and prevent infinite loops
  const isInitializedRef = useRef(false);

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const docs = await documentService.getDocuments(user.id);
      setDocuments(docs);
      setError(null);

      if (!isInitializedRef.current) {
        let docToShow: Document | null = docs[0];
        if (!docToShow) {
          const newDoc = await documentService.createDocument(user.id, {
            title: "Untitled",
            content: "",
            processedContent: "",
          });
          docToShow = newDoc;
        }

        setActiveDocId(docToShow!.id);
        isInitializedRef.current = true;
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load your documents. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [user, activeDocId]);

  const createDocument = useCallback(async () => {
    if (!user) return null;

    try {
      setError(null);
      const newDoc: Omit<Document, "id" | "createdAt" | "updatedAt"> = {
        title: "Untitled",
        content: "",
        processedContent: "",
      };

      const createdDoc = await documentService.createDocument(user.id, newDoc);
      if (createdDoc) {
        // Update documents list without triggering a refetch
        setDocuments((prev) => [createdDoc, ...prev]);
        setActiveDocId(createdDoc.id);
        return createdDoc;
      }
      return null;
    } catch (error) {
      console.error("Error creating new document:", error);
      setError("Failed to create a new document. Please try again later.");
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchDocuments();

    // Subscribe to documents table changes
    const subscription = supabase
      .channel("documents_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // When any change happens, refetch the documents
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchDocuments]);

  const selectDocument = useCallback(
    (doc: Document) => {
      // Don't trigger a state update if it's already the active doc
      if (activeDocId === doc.id) return;
      setActiveDocId(doc.id);
    },
    [activeDocId]
  );

  const updateDocument = useCallback(async (updatedDoc: Document) => {
    try {
      setError(null);
      const result = await documentService.updateDocument(updatedDoc);

      if (result) {
        // Update the document in the local state
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === result.id ? result : doc))
        );
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error updating document:", error);
      setError("Failed to update document. Please try again later.");
      return null;
    }
  }, []);

  const deleteDocument = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const success = await documentService.deleteDocument(id);
        if (id === activeDocId) {
          setActiveDocId(documents[0].id || null);
        }
        return success;
      } catch (error) {
        console.error("Error deleting document:", error);
        setError("Failed to delete document. Please try again later.");
        return false;
      }
    },
    [activeDocId, documents]
  );

  const activeDoc = useMemo(() => {
    return documents.find((doc) => doc.id === activeDocId) || null;
  }, [documents, activeDocId]);

  return {
    documents,
    activeDoc,
    isLoading,
    error,
    selectDocument,
    deleteDocument,
    createDocument,
    updateDocument,
  };
}
