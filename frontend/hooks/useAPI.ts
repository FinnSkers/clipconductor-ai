import { useQuery } from '@tanstack/react-query';
import { aiService, systemService } from '../lib/api';

// AI Hooks
export const useAIModels = () => {
  return useQuery({
    queryKey: ['ai-models'],
    queryFn: () => aiService.getModels().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAIHealth = () => {
  return useQuery({
    queryKey: ['ai-health'],
    queryFn: () => aiService.getHealth().then(res => res.data),
    refetchInterval: 30000, // 30 seconds
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: () => systemService.getHealth().then(res => res.data),
    refetchInterval: 30000, // 30 seconds
  });
};
