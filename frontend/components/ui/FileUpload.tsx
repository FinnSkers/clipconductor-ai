import React from 'react';
import { Upload, X, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesSelect: (files: File[]) => void;
  onRemoveFile?: (index: number) => void;
  files?: File[];
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  dragText?: string;
  browseText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "video/*",
  multiple = true,
  maxSize = 500,
  onFilesSelect,
  onRemoveFile,
  files = [],
  loading = false,
  className,
  children,
  dragText = "Drop your gaming clips here",
  browseText = "Browse files"
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter files by size and type
    const validFiles = newFiles.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={clsx("w-full", className)}>
      {/* Upload Area */}
      <motion.div
        className={clsx(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          isDragOver 
            ? "border-gaming-400 bg-gaming-400/5" 
            : "border-dark-200 hover:border-dark-100",
          loading && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: isDragOver ? 1 : 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
          aria-label="Upload files"
        />

        {children || (
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              className={clsx(
                "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                isDragOver ? "bg-gaming-400/20 text-gaming-400" : "bg-dark-200 text-dark-400"
              )}
              animate={loading ? { rotate: 360 } : {}}
              transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <Upload className="w-8 h-8" />
            </motion.div>

            <div>
              <p className="text-lg font-medium text-white">
                {dragText}
              </p>
              <p className="text-dark-400 mt-1">
                or{" "}
                <span className="text-gaming-400 hover:text-gaming-300 font-medium">
                  {browseText}
                </span>
              </p>
            </div>

            <div className="text-sm text-dark-400">
              <p>Supports: {accept === "video/*" ? "MP4, AVI, MOV, etc." : "Multiple formats"}</p>
              <p>Max size: {maxSize}MB per file</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-dark-900/50 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gaming-400"></div>
              <span className="text-white">Processing...</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-2"
        >
          <h4 className="text-sm font-medium text-white mb-3">
            Selected Files ({files.length})
          </h4>
          
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file);
            
            return (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-dark-100 rounded-lg border border-dark-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-gaming-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-dark-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                {onRemoveFile && (
                  <motion.button
                    onClick={() => onRemoveFile(index)}
                    className="p-1 text-dark-400 hover:text-red-400 transition-colors ml-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
