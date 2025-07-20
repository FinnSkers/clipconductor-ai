import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  PlayCircle, 
  TrendingUp, 
  Gamepad2, 
  Video, 
  Clock, 
  FileVideo,
  Sparkles,
  Download,
  Copy,
  ExternalLink,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { api } from '../lib/api';
import { 
  SearchBar, 
  DataTable, 
  Button, 
  Modal, 
  FileUpload, 
  ProgressBar,
  type Column 
} from '../components/ui';

interface ClipInfo {
  game_name: string;
  original_filename: string;
  timestamp: string;
  file_size: number;
  file_path: string;
  id: string;
}

interface ClipMetadata {
  title: string;
  description: string;
  hashtags: string[];
  platforms: {
    youtube: { title: string; tags: string[] };
    tiktok: { title: string; hashtags: string[] };
    instagram: { title: string; hashtags: string[] };
  };
}

interface ClipResult extends ClipInfo {
  metadata: ClipMetadata;
  processing_status?: 'pending' | 'processing' | 'complete' | 'error';
  processing_progress?: number;
}

const GameIcon = ({ game }: { game: string }) => {
  const gameColors: { [key: string]: string } = {
    'Valorant': 'text-red-400',
    'Marvel Rivals': 'text-blue-400',
    'Unknown': 'text-gray-400'
  };

  return (
    <Gamepad2 className={`w-5 h-5 ${gameColors[game] || 'text-gaming-400'}`} />
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-6 border border-dark-200"
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-dark-500">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-dark-600 mt-1">{subtitle}</p>}
      </div>
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
  </motion.div>
);

export default function ClipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const queryClient = useQueryClient();

  // Fetch clips data
  const { data: clips = [], isLoading, error } = useQuery({
    queryKey: ['clips', searchQuery],
    queryFn: async () => {
      const response = await api.get('/clips', {
        params: { search: searchQuery || undefined }
      });
      return response.data;
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      setIsUploading(true);
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await api.post('/clips/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Files uploaded successfully!');
      setShowUploadModal(false);
      setUploadFiles([]);
      queryClient.invalidateQueries({ queryKey: ['clips'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Upload failed');
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    uploadMutation.mutate(uploadFiles);
  };

  const handleFilesSelect = (files: File[]) => {
    setUploadFiles([...uploadFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadFiles(uploadFiles.filter((_, i) => i !== index));
  };

  const copyMetadata = async (clip: ClipResult, platform: keyof ClipResult['metadata']['platforms']) => {
    const platformData = clip.metadata.platforms[platform];
    const text = `${platformData.title}\n\n${clip.metadata.description}\n\n${
      'hashtags' in platformData ? platformData.hashtags.join(' ') : platformData.tags.join(' ')
    }`;
    
    await navigator.clipboard.writeText(text);
    toast.success(`${platform} content copied to clipboard!`);
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Unknown time';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const handleRowSelect = (index: number, selected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (selected) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === clips.length);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(clips.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
    setSelectAll(selected);
  };

  // Define table columns
  const columns: Column<ClipResult>[] = [
    {
      key: 'game_name',
      title: 'Game',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <GameIcon game={value} />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'original_filename',
      title: 'File Name',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm truncate max-w-[200px]" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'file_size',
      title: 'Size',
      sortable: true,
      render: (value) => formatFileSize(value)
    },
    {
      key: 'timestamp',
      title: 'Created',
      sortable: true,
      render: (value) => formatTimestamp(value)
    },
    {
      key: 'processing_status',
      title: 'Status',
      render: (value, item) => {
        if (value === 'processing') {
          return (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-gaming-400"></div>
                <span className="text-xs text-gaming-400">Processing</span>
              </div>
              {item.processing_progress && (
                <ProgressBar 
                  value={item.processing_progress} 
                  size="sm" 
                  variant="gaming" 
                  className="w-20"
                />
              )}
            </div>
          );
        }
        if (value === 'complete') {
          return <span className="text-green-400 text-xs">✓ Complete</span>;
        }
        if (value === 'error') {
          return <span className="text-red-400 text-xs">✗ Error</span>;
        }
        return <span className="text-yellow-400 text-xs">⏳ Pending</span>;
      }
    },
    {
      key: 'id',
      title: 'Actions',
      render: (value, item) => (
        <div className="flex items-center space-x-2">
          {item.metadata && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyMetadata(item, 'youtube')}
                className="text-red-400 hover:text-red-300"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyMetadata(item, 'tiktok')}
                className="text-pink-400 hover:text-pink-300"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyMetadata(item, 'instagram')}
                className="text-purple-400 hover:text-purple-300"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      )
    }
  ];

  // Filter clips based on search
  const filteredClips = clips.filter((clip: ClipResult) =>
    clip.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clip.game_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: clips.length,
    processing: clips.filter((c: ClipResult) => c.processing_status === 'processing').length,
    complete: clips.filter((c: ClipResult) => c.processing_status === 'complete').length,
    totalSize: clips.reduce((sum: number, c: ClipResult) => sum + c.file_size, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gaming Clips</h1>
          <p className="text-dark-400 mt-1">
            AI-powered highlight detection and multi-platform optimization
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="flex items-center space-x-2">
          <Video className="w-4 h-4" />
          <span>Upload Clips</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clips"
          value={stats.total}
          icon={FileVideo}
          color="text-gaming-400"
        />
        <StatCard
          title="Processing"
          value={stats.processing}
          subtitle="Active jobs"
          icon={Clock}
          color="text-yellow-400"
        />
        <StatCard
          title="Complete"
          value={stats.complete}
          subtitle="Ready to publish"
          icon={PlayCircle}
          color="text-green-400"
        />
        <StatCard
          title="Total Size"
          value={formatFileSize(stats.totalSize)}
          subtitle="Storage used"
          icon={TrendingUp}
          color="text-blue-400"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search clips by name or game..."
            showFilter
            onFilterClick={() => setShowFilters(!showFilters)}
            filterActive={showFilters}
          />
        </div>
        {selectedRows.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-400">
              {selectedRows.size} selected
            </span>
            <Button variant="secondary" size="sm">
              Batch Actions
            </Button>
          </div>
        )}
      </div>

      {/* Clips Table */}
      <DataTable
        data={filteredClips}
        columns={columns}
        loading={isLoading}
        emptyMessage="No clips found. Upload some gaming clips to get started!"
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Gaming Clips"
        size="lg"
      >
        <div className="space-y-6">
          <FileUpload
            accept="video/*"
            multiple
            maxSize={500}
            onFilesSelect={handleFilesSelect}
            onRemoveFile={handleRemoveFile}
            files={uploadFiles}
            loading={isUploading}
            dragText="Drop your gaming clips here"
            browseText="Browse clips"
          />

          {uploadFiles.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-dark-200">
              <p className="text-sm text-dark-400">
                Ready to upload {uploadFiles.length} file(s)
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setUploadFiles([])}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleUpload}
                  loading={isUploading}
                  disabled={uploadFiles.length === 0}
                >
                  Upload & Process
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
