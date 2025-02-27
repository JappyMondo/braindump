"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Document } from "@/lib/types";

interface DocumentManagerProps {
  documents: Document[];
  activeDoc: Document | null;
  onDocumentSelect: (doc: Document) => void;
  isLoading: boolean;
}

export function DocumentManager({
  documents,
  activeDoc,
  onDocumentSelect,
  isLoading,
}: DocumentManagerProps) {
  return (
    <Select
      value={activeDoc?.id}
      onValueChange={(id) => {
        if (id === activeDoc?.id) return;

        const doc = documents.find((d) => d.id === id);
        if (doc) onDocumentSelect(doc);
      }}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue
          placeholder={isLoading ? "Loading..." : "Select a document"}
        />
      </SelectTrigger>
      <SelectContent>
        {documents.map((doc) => (
          <SelectItem
            key={doc.id}
            value={doc.id}
            disabled={doc.id === activeDoc?.id}
          >
            {doc.title.trim() || doc.id || "Untitled"}
            {doc.id === activeDoc?.id && " (current)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
