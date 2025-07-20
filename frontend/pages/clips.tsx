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
  ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';

interface ClipInfo {
  game_name: string;
  original_filename: string;
  timestamp: string;
  file_size: number;
  file_path: string;
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

interface ClipResult {
  clip_info: ClipInfo;
  metadata: ClipMetadata;
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

const ClipCard = ({ result }: { result: ClipResult }) => {
  const [copied, setCopied] = useState(false);

  const copyMetadata = async (platform: string) => {
    const platformData = result.metadata.platforms[platform as keyof typeof result.metadata.platforms];
    const text = `${platformData.title}\n\n${result.metadata.description}\n\n${
      'hashtags' in platformData ? platformData.hashtags.join(' ') : platformData.tags.join(' ')
    }`;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${platform} content copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-100/30 rounded-xl p-6 border border-dark-200 space-y-4"
    >
      {/* Clip Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GameIcon game={result.clip_info.game_name} />
          <div>
            <h3 className="font-semibold text-white">{result.clip_info.game_name}</h3>
            <p className="text-sm text-dark-500">{result.clip_info.original_filename}</p>
          </div>
        </div>
        <div className="text-right text-sm text-dark-500">
          <p>{formatFileSize(result.clip_info.file_size)}</p>
          <p>{formatTimestamp(result.clip_info.timestamp)}</p>
        </div>
      </div>

      {/* AI Generated Content */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-gaming-400" />
          <span className="text-sm font-medium text-gaming-400">AI Generated Content</span>
        </div>
        
        <h4 className="font-semibold text-white">{result.metadata.title}</h4>
        <p className="text-dark-400 text-sm">{result.metadata.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {result.metadata.hashtags.slice(0, 6).map((tag, i) => (
            <span key={i} className="bg-gaming-500/20 text-gaming-400 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
          {result.metadata.hashtags.length > 6 && (
            <span className="text-xs text-dark-500">
              +{result.metadata.hashtags.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Platform Actions */}
      <div className="flex space-x-2">
        {(['youtube', 'tiktok', 'instagram'] as const).map((platform) => (
          <motion.button
            key={platform}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyMetadata(platform)}
            className="flex items-center space-x-1 bg-gaming-600 hover:bg-gaming-500 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span className="capitalize">{platform}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default function Clips() {
  const queryClient = useQueryClient();
  
  // Fetch clips statistics
  const { data: stats } = useQuery({
    queryKey: ['clips-stats'],
    queryFn: async () => {
      const response = await api.get('/clips/stats');
      return response.data;
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  // Process clips mutation
  const processClips = useMutation({
    mutationFn: async (limit: number) => {
      const response = await api.post('/clips/process', { limit });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Clips processed successfully!');
      queryClient.invalidateQueries({ queryKey: ['clips-stats'] });
    },
    onError: (error) => {
      toast.error('Failed to process clips');
      console.error(error);
    }
  });

  const [processedResults, setProcessedResults] = useState<ClipResult[]>([]);
  const [processingLimit, setProcessingLimit] = useState(5);

  const handleProcessClips = async () => {
    try {
      const response = await processClips.mutateAsync(processingLimit);
      setProcessedResults(response.results);
    } catch (error) {
      console.error('Processing failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gaming-400 to-gaming-600 bg-clip-text text-transparent">
              <Video className="inline-block w-8 h-8 mr-3" />
              Gaming Clips Manager
            </h1>
            <p className="text-dark-500 text-lg">
              Process your Outplayed clips with AI-powered metadata generation
            </p>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Clips"
                value={stats.total_clips}
                icon={FileVideo}
                color="text-gaming-400"
              />
              <StatCard
                title="Total Size"
                value={`${stats.total_size_mb} GB`}
                icon={Download}
                color="text-blue-400"
              />
              <StatCard
                title="VALORANT"
                value={stats.games?.Valorant?.count || 0}
                subtitle={`${((stats.games?.Valorant?.size || 0) / (1024 * 1024 * 1024)).toFixed(1)} GB`}
                icon={TrendingUp}
                color="text-red-400"
              />
              <StatCard
                title="Marvel Rivals"
                value={stats.games?.['Marvel Rivals']?.count || 0}
                subtitle={`${((stats.games?.['Marvel Rivals']?.size || 0) / (1024 * 1024)).toFixed(0)} MB`}
                icon={PlayCircle}
                color="text-blue-400"
              />
            </div>
          )}

          {/* Processing Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-dark-100/50 rounded-xl p-6 border border-dark-200 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-gaming-400" />
              AI Clip Processing
            </h2>
            
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-dark-400 mb-2">
                  Number of clips to process:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={processingLimit}
                  onChange={(e) => setProcessingLimit(Number(e.target.value))}
                  className="bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white w-20"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProcessClips}
                disabled={processClips.isPending}
                className="bg-gradient-to-r from-gaming-500 to-gaming-600 hover:from-gaming-600 hover:to-gaming-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {processClips.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Process Clips'
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Processed Results */}
          {processedResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-gaming-400" />
                Recently Processed ({processedResults.length})
              </h2>
              
              <div className="space-y-6">
                {processedResults.map((result, index) => (
                  <ClipCard key={index} result={result} />
                ))}
              </div>
            </motion.div>
          )}

          {processedResults.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-dark-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark-400 mb-2">No clips processed yet</h3>
              <p className="text-dark-500">Click "Process Clips" to generate AI metadata for your gaming clips</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
