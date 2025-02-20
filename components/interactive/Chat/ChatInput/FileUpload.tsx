'use client';

import { LuPaperclip, LuTrash2 } from 'react-icons/lu';
import { useRef, useState } from 'react';
import { useChatInput } from './Provider';
import { InputAdornmentButton } from './Input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

export function UploadedFilesDisplay() {
  const { uploadedFiles } = useChatInput();
  const fileNames = Object.keys(uploadedFiles);

  if (fileNames.length === 0) return null;

  return (
    <div className='flex items-center gap-1 p-1 w-full overflow-x-auto'>
      {fileNames.map((fileName) => (
        <UploadedFileCard key={fileName} fileName={fileName} />
      ))}
    </div>
  );
}

function UploadedFileCard({ fileName }: { fileName: string }) {
  const { removeFile } = useChatInput();
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'unknown';
  const fileType = getFileType(fileExtension);

  return (
    <div className='flex items-start gap-2 bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg px-3 py-2 max-w-fit'>
      <div className='mt-0.5'>
        <LuPaperclip className='w-4 h-4 text-muted-foreground' />
      </div>
      <div className='flex flex-col min-w-20'>
        <span className='text-sm font-medium truncate max-w-[200px]'>{fileName}</span>
        <span className='text-xs text-muted-foreground'>{fileType}</span>
      </div>
      <Button
        size='icon'
        variant='ghost'
        className='h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive mt-0.5'
        onClick={() => removeFile(fileName)}
      >
        <LuTrash2 className='w-3 h-3' />
      </Button>
    </div>
  );
}

function getFileType(extension: string): string {
  const typeMap: Record<string, string> = {
    // Images
    jpg: 'Image (JPEG)',
    jpeg: 'Image (JPEG)',
    png: 'Image (PNG)',
    gif: 'Image (GIF)',
    webp: 'Image (WebP)',
    // Documents
    pdf: 'Document (PDF)',
    doc: 'Document (Word)',
    docx: 'Document (Word)',
    txt: 'Text File',
    md: 'Markdown File',
  };

  return typeMap[extension] || `File (.${extension})`;
}

export function FileUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFile, enableFileUpload } = useChatInput();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  if (!enableFileUpload) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        try {
          await addFile(file);
        } catch (error) {
          toast({
            title: 'File Upload Error',
            description: error instanceof Error ? error.message : 'Failed to upload file',
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt', '.md'].join(',');

  return (
    <>
      <input type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' multiple accept={acceptedTypes} />
      <InputAdornmentButton title='Upload Files' onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
        <LuPaperclip className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
      </InputAdornmentButton>
    </>
  );
}
