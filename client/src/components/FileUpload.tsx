import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptMultiple?: boolean;
  accept?: string;
  maxSize?: number;
  variant?: 'dropzone' | 'button';
  buttonText?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function FileUpload({ 
  onFilesSelected, 
  acceptMultiple = false, 
  accept = ".pdf",
  maxSize = 50 * 1024 * 1024, // 50MB default
  variant = 'dropzone',
  buttonText = 'Select Files',
  className = '',
  title = 'Drag and drop PDF files here',
  subtitle = 'or click to select PDF files'
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  // Create accept object based on accept prop
  const getAcceptObject = (acceptString: string) => {
    if (acceptString.includes('.png') || acceptString.includes('image/png')) {
      return {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg']
      };
    }
    if (acceptString.includes('.docx') || acceptString.includes('wordprocessingml')) {
      return {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc']
      };
    }
    if (acceptString.includes('.xlsx') || acceptString.includes('spreadsheetml')) {
      return {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
      };
    }
    return {
      'application/pdf': ['.pdf']
    };
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: getAcceptObject(accept),
    multiple: acceptMultiple,
    maxSize,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (variant === 'button') {
    return (
      <div className={className}>
        <input {...getInputProps()} />
        <Button
          {...getRootProps()}
          variant="outline"
          size="lg"
          className="px-6"
        >
          <Upload className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center bg-gray-50 dark:bg-gray-800 transition-all cursor-pointer ${
        isDragActive
          ? "border-pdfo-blue dark:border-pdfo-blue bg-blue-50 dark:bg-blue-950"
          : "border-gray-300 dark:border-gray-600 hover:border-pdfo-blue dark:hover:border-pdfo-blue"
      } ${className}`}
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
        {isDragActive ? "Drop your files here" : title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {isDragActive 
          ? "Release to upload" 
          : subtitle
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
