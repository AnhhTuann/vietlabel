import { useEffect, useRef, useState, useCallback } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export interface RealtimeEventPayload {
  type: string;
  data: any;
  timestamp: string;
}

export function useAdminRealtime(onEvent?: (event: string, data: any) => void) {
  const { token, isAuthenticated } = useAdminAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      // Synthesize quick crisp notification beep using Web Audio API
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // ignore audio play restriction
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setIsConnected(false);
      return;
    }

    // SSE connection with authorization token as query param
    const url = `/api/admin/events`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
    };

    es.onerror = () => {
      setIsConnected(false);
    };

    const handleMessage = (evtName: string, e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (evtName === 'notification:new' || evtName === 'lead:new') {
          playChime();
          setLastNotification(data);
        }
        onEvent?.(evtName, data);
      } catch (err) {
        // ignore
      }
    };

    es.addEventListener('lead:new', (e) => handleMessage('lead:new', e));
    es.addEventListener('lead:updated', (e) => handleMessage('lead:updated', e));
    es.addEventListener('message:new', (e) => handleMessage('message:new', e));
    es.addEventListener('conversation:modeChanged', (e) => handleMessage('conversation:modeChanged', e));
    es.addEventListener('notification:new', (e) => handleMessage('notification:new', e));

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [isAuthenticated, token, onEvent, playChime]);

  return {
    isConnected,
    lastNotification,
    soundEnabled,
    toggleSound: () => setSoundEnabled(prev => !prev),
    playChime,
  };
}
