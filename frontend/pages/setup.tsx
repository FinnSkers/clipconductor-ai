import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Bot, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Monitor,
  Smartphone,
  Globe,
  MessageCircle,
  Settings,
  Play,
  Upload,
  Bell,
  Brain,
  Cpu,
  Download
} from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

interface ServiceConfig {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  color: string;
}

interface SetupData {
  outplayedPath: string;
  selectedServices: string[];
  telegramBotToken: string;
  telegramChatId: string;
  discordWebhook: string;
  slackWebhook: string;
  autoProcessing: boolean;
  ollamaSettings: {
    selectedModel: string;
    customPrompt: string;
    temperature: number;
    maxTokens: number;
    autoDownloadModels: boolean;
  };
  notificationSettings: {
    newClips: boolean;
    processingComplete: boolean;
    errors: boolean;
    dailyStats: boolean;
  };
}

const steps: SetupStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ClipConductor AI',
    description: 'Let\'s set up your gaming content creation pipeline',
    icon: Bot
  },
  {
    id: 'folder',
    title: 'Configure Clip Source',
    description: 'Select your gaming clips folder location',
    icon: FolderOpen
  },
  {
    id: 'services',
    title: 'Choose Platforms',
    description: 'Select which platforms to optimize content for',
    icon: Globe
  },
  {
    id: 'ai-models',
    title: 'AI Models Setup',
    description: 'Configure Ollama models for content generation',
    icon: Brain
  },
  {
    id: 'notifications',
    title: 'Setup Notifications',
    description: 'Configure alerts and status updates',
    icon: Bell
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'Your ClipConductor AI is ready to use',
    icon: CheckCircle
  }
];

const services: ServiceConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube Shorts',
    icon: Play,
    description: 'Optimize for YouTube\'s algorithm with engaging titles',
    enabled: true,
    color: 'text-red-500'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Smartphone,
    description: 'Trendy hashtags and viral content optimization',
    enabled: true,
    color: 'text-pink-500'
  },
  {
    id: 'instagram',
    name: 'Instagram Reels',
    icon: Upload,
    description: 'Stories and Reels with perfect formatting',
    enabled: true,
    color: 'text-purple-500'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: MessageCircle,
    description: 'Short-form content with gaming hashtags',
    enabled: false,
    color: 'text-blue-500'
  }
];

export default function Setup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    outplayedPath: 'E:\\contentio\\Outplayed',
    selectedServices: ['youtube', 'tiktok', 'instagram'],
    telegramBotToken: '',
    telegramChatId: '',
    discordWebhook: '',
    slackWebhook: '',
    autoProcessing: false,
    ollamaSettings: {
      selectedModel: 'deepseek-r1:latest',
      customPrompt: 'Generate engaging social media content for this gaming clip',
      temperature: 0.7,
      maxTokens: 500,
      autoDownloadModels: true
    },
    notificationSettings: {
      newClips: true,
      processingComplete: true,
      errors: true,
      dailyStats: false
    }
  });

  const [availableModels, setAvailableModels] = useState<string[]>([
    'deepseek-r1:latest',
    'llama3.2:latest', 
    'mistral:latest'
  ]);
  const [ollamaHealth, setOllamaHealth] = useState<any>(null);

  // Fetch available models from Ollama
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const api = axios.create({
          baseURL: 'http://localhost:8001/api/v1',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const response = await api.get('/ai/health');
        setOllamaHealth(response.data);
        
        // Update available models if we get them from the API
        if (response.data.ollama?.models_available) {
          // For now, keep default models but show count from API
        }
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error);
      }
    };

    fetchModels();
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = async () => {
    try {
      // Save configuration to localStorage or API
      localStorage.setItem('clipconductor-setup', JSON.stringify(setupData));
      localStorage.setItem('clipconductor-setup-complete', 'true');
      
      toast.success('Setup completed successfully!');
      
      // Redirect to main dashboard
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      toast.error('Failed to save setup configuration');
      console.error(error);
    }
  };

  const updateSetupData = (field: keyof SetupData, value: any) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setSetupData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 bg-gradient-to-br from-gaming-400 to-gaming-600 rounded-full flex items-center justify-center mx-auto"
            >
              <Bot className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to ClipConductor AI</h2>
              <p className="text-dark-400 text-lg max-w-md mx-auto">
                Transform your gaming clips into viral social media content with AI-powered metadata generation and multi-platform optimization.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-gaming-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-gaming-400" />
                </div>
                <p className="text-sm text-dark-400">AI Processing</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gaming-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-gaming-400" />
                </div>
                <p className="text-sm text-dark-400">Multi-Platform</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gaming-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Monitor className="w-6 h-6 text-gaming-400" />
                </div>
                <p className="text-sm text-dark-400">Real-time</p>
              </div>
            </div>
          </div>
        );

      case 'folder':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FolderOpen className="w-16 h-16 text-gaming-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Configure Clip Source</h2>
              <p className="text-dark-400">Where are your gaming clips stored?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Outplayed Folder Path
                </label>
                <input
                  type="text"
                  value={setupData.outplayedPath}
                  onChange={(e) => updateSetupData('outplayedPath', e.target.value)}
                  className="w-full bg-dark-200 border border-dark-300 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  placeholder="E:\contentio\Outplayed"
                />
                <p className="text-xs text-dark-500 mt-1">
                  This is typically where Outplayed saves your gaming clips
                </p>
              </div>

              <div className="bg-dark-100/50 rounded-lg p-4 border border-dark-200">
                <div className="flex items-start space-x-3">
                  <Settings className="w-5 h-5 text-gaming-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Auto-Processing</h4>
                    <p className="text-xs text-dark-400 mb-3">
                      Automatically process new clips when they're added to the folder
                    </p>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={setupData.autoProcessing}
                        onChange={(e) => updateSetupData('autoProcessing', e.target.checked)}
                        className="rounded border-dark-300 bg-dark-200 text-gaming-500 focus:ring-gaming-500"
                      />
                      <span className="ml-2 text-sm text-dark-300">Enable auto-processing</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="w-16 h-16 text-gaming-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Choose Platforms</h2>
              <p className="text-dark-400">Select which platforms to optimize your content for</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    relative bg-dark-100/50 rounded-lg p-4 border cursor-pointer transition-all
                    ${setupData.selectedServices.includes(service.id)
                      ? 'border-gaming-500 bg-gaming-500/10'
                      : 'border-dark-200 hover:border-dark-300'
                    }
                  `}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-dark-200`}>
                      <service.icon className={`w-5 h-5 ${service.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{service.name}</h3>
                      <p className="text-sm text-dark-400">{service.description}</p>
                    </div>
                    {setupData.selectedServices.includes(service.id) && (
                      <CheckCircle className="w-5 h-5 text-gaming-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'ai-models':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="w-16 h-16 text-gaming-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">AI Models Setup</h2>
              <p className="text-dark-400">Configure Ollama models for generating engaging content</p>
            </div>

            {/* Model Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Select Primary Model
                </label>
                <select
                  value={setupData.ollamaSettings.selectedModel}
                  onChange={(e) => setSetupData({
                    ...setupData,
                    ollamaSettings: {
                      ...setupData.ollamaSettings,
                      selectedModel: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-lg text-white focus:border-gaming-500 focus:outline-none"
                >
                  {availableModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Custom Prompt Template
                </label>
                <textarea
                  value={setupData.ollamaSettings.customPrompt}
                  onChange={(e) => setSetupData({
                    ...setupData,
                    ollamaSettings: {
                      ...setupData.ollamaSettings,
                      customPrompt: e.target.value
                    }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-lg text-white focus:border-gaming-500 focus:outline-none resize-none"
                  placeholder="Describe the prompt template for AI content generation..."
                />
              </div>

              {/* Model Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Temperature: {setupData.ollamaSettings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={setupData.ollamaSettings.temperature}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      ollamaSettings: {
                        ...setupData.ollamaSettings,
                        temperature: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full accent-gaming-500"
                  />
                  <p className="text-xs text-dark-400 mt-1">Controls creativity (0 = focused, 1 = creative)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="50"
                    value={setupData.ollamaSettings.maxTokens}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      ollamaSettings: {
                        ...setupData.ollamaSettings,
                        maxTokens: parseInt(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-lg text-white focus:border-gaming-500 focus:outline-none"
                  />
                  <p className="text-xs text-dark-400 mt-1">Maximum response length</p>
                </div>
              </div>

              {/* Auto Download Models */}
              <div className="flex items-center justify-between p-4 bg-dark-100/50 rounded-lg border border-dark-200">
                <div>
                  <h3 className="font-medium text-white">Auto-download Models</h3>
                  <p className="text-sm text-dark-400">Automatically download new models when available</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={setupData.ollamaSettings.autoDownloadModels}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      ollamaSettings: {
                        ...setupData.ollamaSettings,
                        autoDownloadModels: e.target.checked
                      }
                    })}
                  />
                  <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gaming-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-600"></div>
                </label>
              </div>

              {/* Ollama Status */}
              <div className="p-4 bg-dark-100/30 rounded-lg border border-dark-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-gaming-400" />
                    Ollama Status
                  </h3>
                  <span className={`text-sm ${ollamaHealth?.ollama?.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>
                    ● {ollamaHealth?.ollama?.status === 'healthy' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="text-sm text-dark-400 space-y-1">
                  <p>• Available Models: {ollamaHealth?.ollama?.models_available || availableModels.length}</p>
                  <p>• Current Model: {setupData.ollamaSettings.selectedModel}</p>
                  <p>• Service URL: {ollamaHealth?.ollama?.base_url || 'http://localhost:11434'}</p>
                </div>
                {ollamaHealth?.ollama?.status !== 'healthy' && (
                  <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                    ⚠️ Ollama service is not running. Please start Ollama to use AI features.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Bell className="w-16 h-16 text-gaming-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Setup Notifications</h2>
              <p className="text-dark-400">Stay updated with your content processing status</p>
            </div>

            <div className="space-y-6">
              {/* Telegram Setup */}
              <div className="bg-dark-100/50 rounded-lg p-6 border border-dark-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Telegram Notifications</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Bot Token
                    </label>
                    <input
                      type="text"
                      value={setupData.telegramBotToken}
                      onChange={(e) => updateSetupData('telegramBotToken', e.target.value)}
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                      placeholder="1234567890:ABCDEFghijklmnopQRSTUVwxyz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Chat ID
                    </label>
                    <input
                      type="text"
                      value={setupData.telegramChatId}
                      onChange={(e) => updateSetupData('telegramChatId', e.target.value)}
                      className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                      placeholder="-1001234567890"
                    />
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">How to setup Telegram Bot:</h4>
                    <ol className="text-xs text-blue-300 space-y-1 list-decimal list-inside">
                      <li>Open Telegram and search for @BotFather</li>
                      <li>Send /newbot and follow instructions to create your bot</li>
                      <li>Copy the bot token from BotFather</li>
                      <li>Add your bot to a group/channel</li>
                      <li>Send a message in the group, then visit: https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates</li>
                      <li>Copy the chat ID from the response</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Discord Setup */}
              <div className="bg-dark-100/50 rounded-lg p-6 border border-dark-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Discord Notifications</h3>
                </div>
                <input
                  type="text"
                  value={setupData.discordWebhook}
                  onChange={(e) => updateSetupData('discordWebhook', e.target.value)}
                  className="w-full bg-dark-200 border border-dark-300 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  placeholder="https://discord.com/api/webhooks/..."
                />
              </div>

              {/* Notification Settings */}
              <div className="bg-dark-100/50 rounded-lg p-6 border border-dark-200">
                <h3 className="text-lg font-semibold text-white mb-4">Notification Types</h3>
                <div className="space-y-3">
                  {Object.entries(setupData.notificationSettings).map(([key, enabled]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateSetupData('notificationSettings', {
                          ...setupData.notificationSettings,
                          [key]: e.target.checked
                        })}
                        className="rounded border-dark-300 bg-dark-200 text-gaming-500 focus:ring-gaming-500"
                      />
                      <span className="ml-3 text-sm text-dark-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">All Set!</h2>
              <p className="text-dark-400 text-lg max-w-md mx-auto">
                Your ClipConductor AI is configured and ready to transform your gaming clips into viral content.
              </p>
            </div>

            <div className="bg-dark-100/50 rounded-lg p-6 border border-dark-200 max-w-md mx-auto">
              <h3 className="font-semibold text-white mb-4">Setup Summary</h3>
              <div className="space-y-2 text-sm text-dark-400 text-left">
                <p><strong>Folder:</strong> {setupData.outplayedPath}</p>
                <p><strong>Platforms:</strong> {setupData.selectedServices.length} selected</p>
                <p><strong>Auto-processing:</strong> {setupData.autoProcessing ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Telegram:</strong> {setupData.telegramBotToken ? 'Configured' : 'Not set'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2
                    ${index <= currentStep
                      ? 'bg-gaming-500 border-gaming-500 text-white'
                      : 'border-dark-300 text-dark-400'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-4
                    ${index < currentStep ? 'bg-gaming-500' : 'bg-dark-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">{steps[currentStep].title}</h1>
            <p className="text-dark-400">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-dark-200 hover:bg-dark-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </motion.button>

          {currentStep === steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={completeSetup}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-gaming-500 to-gaming-600 hover:from-gaming-600 hover:to-gaming-700 rounded-lg font-medium transition-all"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gaming-500 to-gaming-600 hover:from-gaming-600 hover:to-gaming-700 rounded-lg font-medium transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
