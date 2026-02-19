'use client';

import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

export default function PerformanceMonitor() {
  usePerformanceMonitoring();
  return null;
}
