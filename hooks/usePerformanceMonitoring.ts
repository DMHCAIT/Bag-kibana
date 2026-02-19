import { useEffect } from 'react';

interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  url: string;
  timestamp: number;
}

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Check if running in browser and performance APIs are available
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const win = window as WindowWithGtag;

    // Track page load time
    const trackPageLoadTime = () => {
      if (performance && performance.timing) {
        const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        
        const metrics: PerformanceMetrics = {
          pageLoadTime,
          timeToFirstByte: performance.timing.responseStart - performance.timing.navigationStart,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0,
          url: window.location.pathname,
          timestamp: Date.now(),
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Performance Metrics:', metrics);
        }

        // Send to analytics (optional - only if analytics service is available)
        if (win.gtag) {
          win.gtag('event', 'page_load_time', {
            value: pageLoadTime,
            event_category: 'performance',
          });
        }
      }
    };

    // Track Core Web Vitals using PerformanceObserver
    const observeMetrics = () => {
      try {
        // Observe Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
          if (win.gtag) {
            win.gtag('event', 'largest_contentful_paint', {
              value: Math.round((lastEntry.renderTime ?? lastEntry.loadTime) ?? 0),
              event_category: 'web_vitals',
            });
          }
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch {
          // Observer not supported in this browser
        }

        // Observe Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!layoutEntry.hadRecentInput) {
              clsValue += layoutEntry.value ?? 0;
              if (win.gtag) {
                win.gtag('event', 'cumulative_layout_shift', {
                  value: Math.round(clsValue * 1000) / 1000,
                  event_category: 'web_vitals',
                });
              }
            }
          }
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch {
          // Observer not supported in this browser
        }

        // Observe First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as PerformanceEntry & { processingDuration?: number };
            if (win.gtag) {
              win.gtag('event', 'first_input_delay', {
                value: Math.round(fidEntry.processingDuration ?? 0),
                event_category: 'web_vitals',
              });
            }
          });
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch {
          // Observer not supported in this browser
        }
      } catch {
        // Silently fail if observers are not supported
        console.debug('Performance Observer not fully supported');
      }
    };

    // Run metrics after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          trackPageLoadTime();
          observeMetrics();
        }, 0);
      });
    } else {
      trackPageLoadTime();
      observeMetrics();
    }

    // Also track when page is hidden (to capture metrics even if user closes tab early)
    const handleVisibilityChange = () => {
      if (document.hidden && win.gtag) {
        if (performance && performance.timing) {
          const sessionDuration = Date.now() - performance.timing.navigationStart;
          win.gtag('event', 'session_duration', {
            value: sessionDuration,
            event_category: 'engagement',
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
