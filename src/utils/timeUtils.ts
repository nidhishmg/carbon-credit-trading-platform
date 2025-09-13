// Real-time utilities for consistent time display across the platform
import { useState, useEffect } from 'react';

/**
 * Hook for real-time current time that updates every second
 */
export const useRealTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
};

/**
 * Format timestamp for consistent display across platform
 * @param timestamp - Date object or ISO string
 * @param options - Formatting options
 */
export const formatRealTime = (
  timestamp: string | Date = new Date(), 
  options: {
    showSeconds?: boolean;
    timeZone?: string;
    hour12?: boolean;
  } = {}
) => {
  const {
    showSeconds = true,
    timeZone = 'Asia/Kolkata',
    hour12 = true
  } = options;

  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  return date.toLocaleString('en-IN', {
    timeZone,
    hour12,
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds && { second: '2-digit' }),
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Get relative time (e.g., "2 minutes ago", "just now")
 * @param timestamp - Date object or ISO string
 */
export const getRelativeTime = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 30) {
    return 'just now';
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return formatRealTime(timestamp, { showSeconds: false });
  }
};

/**
 * Hook for live status indicator with real-time updates
 */
export const useLiveStatus = () => {
  const [isLive, setIsLive] = useState(true);
  
  useEffect(() => {
    // Simulate live connection status
    const statusInterval = setInterval(() => {
      setIsLive(Math.random() > 0.1); // 90% uptime simulation
    }, 30000); // Check every 30 seconds

    return () => clearInterval(statusInterval);
  }, []);

  return isLive;
};