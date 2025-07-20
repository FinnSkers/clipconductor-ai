import { motion } from 'framer-motion';
import { useAIHealth, useSystemHealth } from '../hooks/useAPI';
import { Activity, CheckCircle, XCircle, AlertTriangle, Cpu, Database } from 'lucide-react';

const StatusCard = ({ title, status, data, icon: Icon }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-6 border border-dark-200"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Icon className="w-6 h-6 mr-3 text-gaming-400" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex items-center">
        {status === 'healthy' ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : status === 'unhealthy' ? (
          <XCircle className="w-5 h-5 text-red-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
        )}
        <span className={`ml-2 text-sm font-medium capitalize ${
          status === 'healthy' ? 'text-green-400' : 
          status === 'unhealthy' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {status}
        </span>
      </div>
    </div>
    <pre className="text-sm text-dark-600 overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  </motion.div>
);

export default function Health() {
  const { data: aiHealth, isLoading: aiLoading, error: aiError } = useAIHealth();
  const { data: systemHealth, isLoading: systemLoading, error: systemError } = useSystemHealth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gaming-400 to-gaming-600 bg-clip-text text-transparent">
              <Activity className="inline-block w-8 h-8 mr-3" />
              System Health Monitor
            </h1>
            <p className="text-dark-500 text-lg">
              Real-time monitoring of backend services and AI systems
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {systemLoading ? (
                <div className="bg-dark-100/50 rounded-xl p-6 border border-dark-200">
                  <div className="animate-pulse flex items-center">
                    <Database className="w-6 h-6 mr-3 text-gaming-400" />
                    <div className="h-4 bg-dark-300 rounded w-1/3"></div>
                  </div>
                </div>
              ) : systemError ? (
                <StatusCard
                  title="Backend System"
                  status="unhealthy"
                  data={{ error: 'Failed to connect to backend' }}
                  icon={Database}
                />
              ) : (
                <StatusCard
                  title="Backend System"
                  status={systemHealth?.status || 'unknown'}
                  data={systemHealth}
                  icon={Database}
                />
              )}
            </motion.div>

            {/* AI Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {aiLoading ? (
                <div className="bg-dark-100/50 rounded-xl p-6 border border-dark-200">
                  <div className="animate-pulse flex items-center">
                    <Cpu className="w-6 h-6 mr-3 text-gaming-400" />
                    <div className="h-4 bg-dark-300 rounded w-1/3"></div>
                  </div>
                </div>
              ) : aiError ? (
                <StatusCard
                  title="AI Services"
                  status="unhealthy"
                  data={{ error: 'Failed to connect to AI services' }}
                  icon={Cpu}
                />
              ) : (
                <StatusCard
                  title="AI Services"
                  status={aiHealth?.ollama?.status || 'unknown'}
                  data={aiHealth}
                  icon={Cpu}
                />
              )}
            </motion.div>
          </div>

          {/* Detailed AI Status */}
          {aiHealth && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <div className="bg-dark-100/30 rounded-xl p-6 border border-dark-200">
                <h2 className="text-2xl font-bold text-gaming-400 mb-6">AI Service Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-dark-200/50 rounded-lg p-4">
                    <h3 className="font-semibold text-dark-700 mb-3">Ollama Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-medium ${
                          aiHealth.ollama?.status === 'healthy' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {aiHealth.ollama?.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base URL:</span>
                        <span className="text-gaming-400">{aiHealth.ollama?.base_url}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Models Available:</span>
                        <span className="font-bold text-gaming-400">{aiHealth.ollama?.models_available}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Default Model:</span>
                        <span className="text-gaming-400">{aiHealth.ollama?.default_model}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-200/50 rounded-lg p-4">
                    <h3 className="font-semibold text-dark-700 mb-3">Computer Vision</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium text-yellow-400">
                          {aiHealth.computer_vision?.status}
                        </span>
                      </div>
                      <p className="text-dark-500 text-xs mt-2">
                        {aiHealth.computer_vision?.note}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
