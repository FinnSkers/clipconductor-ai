import { useState } from 'react';
import { motion } from 'framer-motion';
import { aiService } from '../lib/api';
import { useDebounce } from '../hooks/useUtils';
import { Loader2, Sparkles, Copy, Download, Wand2, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Modal, ProgressBar, SearchBar } from '../components/ui';

interface MetadataResult {
  title: string;
  description: string;
  hashtags: string[];
  platforms: {
    youtube: { title: string; tags: string };
    tiktok: { title: string; hashtags: string };
    instagram: { title: string; hashtags: string };
  };
}

export default function AIMetadata() {
  const [clipTitle, setClipTitle] = useState('');
  const [gameName, setGameName] = useState('');
  const [clipDuration, setClipDuration] = useState<number>(60);
  const [result, setResult] = useState<MetadataResult | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedTitle = useDebounce(clipTitle, 300);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipTitle.trim()) {
      toast.error('Please enter a clip title');
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const res = await aiService.generateMetadata({
        clip_title: clipTitle,
        game_name: gameName || undefined,
        clip_duration: clipDuration,
      });
      
      setResult(res.data.metadata);
      toast.success('Metadata generated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to generate metadata');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-200 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gaming-400 to-gaming-600 bg-clip-text text-transparent">
              <Sparkles className="inline-block w-8 h-8 mr-3" />
              AI-Powered Metadata Generation
            </h1>
            <p className="text-dark-500 text-lg">
              Generate engaging titles, descriptions, and hashtags for your gaming clips
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-8 border border-dark-200"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-dark-700">
                    Clip Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-dark-200 text-white border border-dark-300 focus:border-gaming-500 focus:ring-2 focus:ring-gaming-500/20 transition-all"
                    value={clipTitle}
                    onChange={(e) => setClipTitle(e.target.value)}
                    placeholder="Epic Boss Fight Victory"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-dark-700">
                    Game Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-dark-200 text-white border border-dark-300 focus:border-gaming-500 focus:ring-2 focus:ring-gaming-500/20 transition-all"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Dark Souls, Valorant, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-dark-700">
                    Clip Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    className="w-full px-4 py-3 rounded-lg bg-dark-200 text-white border border-dark-300 focus:border-gaming-500 focus:ring-2 focus:ring-gaming-500/20 transition-all"
                    value={clipDuration}
                    onChange={(e) => setClipDuration(parseInt(e.target.value) || 60)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !clipTitle.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-gaming-600 to-gaming-700 hover:from-gaming-700 hover:to-gaming-800 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Metadata
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-8 border border-dark-200"
            >
              {result ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gaming-400 mb-4">Generated Metadata</h2>
                  
                  {/* Title */}
                  <div className="bg-dark-200/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-dark-700">Title</h3>
                      <button
                        onClick={() => copyToClipboard(result.title, 'Title')}
                        className="p-1 hover:bg-dark-300 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-white">{result.title}</p>
                  </div>

                  {/* Description */}
                  <div className="bg-dark-200/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-dark-700">Description</h3>
                      <button
                        onClick={() => copyToClipboard(result.description, 'Description')}
                        className="p-1 hover:bg-dark-300 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-white">{result.description}</p>
                  </div>

                  {/* Hashtags */}
                  <div className="bg-dark-200/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-dark-700">Hashtags</h3>
                      <button
                        onClick={() => copyToClipboard(result.hashtags.join(' '), 'Hashtags')}
                        className="p-1 hover:bg-dark-300 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gaming-600/20 text-gaming-400 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Platform-specific */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-dark-700">Platform Optimized</h3>
                    {Object.entries(result.platforms).map(([platform, data]) => (
                      <div key={platform} className="bg-dark-200/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="capitalize font-medium text-gaming-400">{platform}</span>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(data, null, 2), `${platform} data`)}
                            className="p-1 hover:bg-dark-300 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-sm text-dark-600">
                          <p><strong>Title:</strong> {data.title}</p>
                          {data.tags && <p><strong>Tags:</strong> {data.tags}</p>}
                          {data.hashtags && <p><strong>Hashtags:</strong> {data.hashtags}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-dark-600 mb-2">Ready to Generate</h3>
                  <p className="text-dark-500">
                    Fill out the form and click generate to create engaging metadata for your gaming clips
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
