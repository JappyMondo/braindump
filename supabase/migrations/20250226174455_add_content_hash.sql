-- Add content_hash column to documents table
ALTER TABLE IF EXISTS public.documents
ADD COLUMN IF NOT EXISTS content_hash TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS documents_content_hash_idx ON public.documents(content_hash);

COMMENT ON COLUMN public.documents.content_hash IS 'Hash of the document content to track processing state'; 