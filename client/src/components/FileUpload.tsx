import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptMultiple?: boolean;
  acceptedTypes?: string;
  maxSize?: number;
}

export function FileUpload({ 
  onFilesSelected, 
  acceptMultiple = false, 
  acceptedTypes = ".pdf",
  maxSize = 50 * 1024 * 1024 // 50MB default
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: acceptMultiple,
    maxSize,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center bg-gray-50 dark:bg-gray-800 transition-all cursor-pointer ${
        isDragActive
          ? "border-pdfo-blue dark:border-pdfo-blue bg-blue-50 dark:bg-blue-950"
          : "border-gray-300 dark:border-gray-600 hover:border-pdfo-blue dark:hover:border-pdfo-blue"
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="mb-4">
        {isDragActive ? (
          <FileText className="h-12 w-12 text-pdfo-blue mx-auto" />
        ) : (
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {isDragActive ? "Drop your PDF files here" : "Upload your PDF files"}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {isDragActive 
          ? "Release to upload" 
          : "Click to select files or drag and drop them here"
        }
      </p>
      
      <Button className="bg-pdfo-blue text-white hover:bg-blue-600">
        Select Files
      </Button>
      
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
        Supports PDF files up to {Math.round(maxSize / (1024 * 1024))}MB each
      </p>
    </div>
  );
}
