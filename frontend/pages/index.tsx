import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  Activity,
  Video,
  TrendingUp,
  Users,
  Settings,
  Bell,
  Play,
  FileVideo,
  Zap,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button, ProgressBar } from '../components/ui';

interface DashboardStats {
  total_clips: number;
  total_size_mb: number;
  games: Record<string, { count: number; size: number }>;
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-6 border border-dark-200"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-medium text-dark-500">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-dark-600 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg bg-dark-200/50`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    {trend && (
      <div className="flex items-center text-xs text-green-400">
        <TrendingUp className="w-3 h-3 mr-1" />
        <span>{trend}</span>
      </div>
    )}
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-dark-100/30 backdrop-blur-sm rounded-xl p-6 border border-dark-200 cursor-pointer hover:border-gaming-500/50 transition-all"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-dark-400">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const router = useRouter();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if setup is complete
  useEffect(() => {
    const setupComplete = localStorage.getItem('clipconductor-setup-complete');
    if (!setupComplete) {
      router.push('/setup');
      return;
    }
    setIsSetupComplete(true);
    setIsLoading(false);
  }, [router]);

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/clips/stats');
      return response.data;
    },
    refetchInterval: 30000,
    enabled: isSetupComplete
  });

  // Fetch AI health
  const { data: aiHealth } = useQuery({
    queryKey: ['ai-health'],
    queryFn: async () => {
      const response = await api.get('/ai/health');
      return response.data;
    },
    refetchInterval: 10000,
    enabled: isSetupComplete
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gaming-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isSetupComplete) {
    return null; // Will redirect to setup
  }

  const quickActions = [
    {
      title: 'Process Clips',
      description: 'Generate AI metadata for your gaming clips',
      icon: Zap,
      color: 'bg-gaming-600',
      onClick: () => router.push('/clips')
    },
    {
      title: 'AI Metadata',
      description: 'Custom metadata generation tool',
      icon: Play,
      color: 'bg-blue-600',
      onClick: () => router.push('/ai-metadata')
    },
    {
      title: 'System Health',
      description: 'Monitor AI services and system status',
      icon: Activity,
      color: 'bg-green-600',
      onClick: () => router.push('/health')
    },
    {
      title: 'Settings',
      description: 'Configure notifications and preferences',
      icon: Settings,
      color: 'bg-purple-600',
      onClick: () => router.push('/setup')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 text-white">
      <Head>
        <title>ClipConductor AI Dashboard</title>
        <meta name="description" content="AI-powered gaming content creation and distribution" />
      </Head>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gaming-400 to-gaming-600 bg-clip-text text-transparent">
                  ClipConductor AI
                </h1>
                <p className="text-dark-500 text-lg mt-2">
                  Your AI-powered gaming content creation dashboard
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${aiHealth?.ollama?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-dark-400">
                  AI Services {aiHealth?.ollama?.status === 'healthy' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Clips"
                value={stats.total_clips || 0}
                icon={FileVideo}
                color="text-gaming-400"
                trend="+12% this week"
              />
              <StatCard
                title="Collection Size"
                value={`${(stats.total_size_mb / 1024).toFixed(1)} GB`}
                icon={Video}
                color="text-blue-400"
              />
              <StatCard
                title="VALORANT Clips"
                value={stats.games?.Valorant?.count || 0}
                subtitle={`${((stats.games?.Valorant?.size || 0) / (1024 * 1024 * 1024)).toFixed(1)} GB`}
                icon={Play}
                color="text-red-400"
              />
              <StatCard
                title="Marvel Rivals"
                value={stats.games?.['Marvel Rivals']?.count || 0}
                subtitle={`${((stats.games?.['Marvel Rivals']?.size || 0) / (1024 * 1024)).toFixed(0)} MB`}
                icon={Users}
                color="text-purple-400"
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <QuickActionCard {...action} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-100/50 rounded-xl p-6 border border-dark-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-gaming-400" />
                System Overview
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/health')}
                className="text-gaming-400 hover:text-gaming-300 text-sm font-medium"
              >
                View Details →
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-200/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-400 text-sm">AI Models</span>
                  <span className="text-gaming-400 font-semibold">
                    {aiHealth?.ollama?.models_available || 0}
                  </span>
                </div>
                <div className="text-xs text-dark-500">
                  {aiHealth?.ollama?.default_model || 'No model loaded'}
                </div>
              </div>
              
              <div className="bg-dark-200/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-400 text-sm">Clip Processing</span>
                  <span className="text-green-400 font-semibold">Ready</span>
                </div>
                <div className="text-xs text-dark-500">
                  Auto-processing enabled
                </div>
              </div>
              
              <div className="bg-dark-200/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-400 text-sm">Notifications</span>
                  <span className="text-blue-400 font-semibold">Configured</span>
                </div>
                <div className="text-xs text-dark-500">
                  Telegram & Discord ready
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
