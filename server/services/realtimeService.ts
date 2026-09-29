import { Response } from 'express';

interface RealtimeClient {
  id: string;
  res: Response;
  userId?: string;
}

class RealtimeHub {
  private clients: Map<string, RealtimeClient> = new Map();

  public register(id: string, res: Response, userId?: string) {
    this.clients.set(id, { id, res, userId });
    console.log(`[REALTIME SSE] Client connected: ${id} (Total: ${this.clients.size})`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Initial ping
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId: id, timestamp: new Date().toISOString() })}\n\n`);

    reqCloseHandler: {
      const onClose = () => {
        this.clients.delete(id);
        console.log(`[REALTIME SSE] Client disconnected: ${id} (Remaining: ${this.clients.size})`);
      };
      res.on('close', onClose);
    }
  }

  public broadcast(eventName: string, payload: any) {
    const dataString = JSON.stringify(payload);
    const message = `event: ${eventName}\ndata: ${dataString}\n\n`;

    for (const [id, client] of this.clients.entries()) {
      try {
        client.res.write(message);
      } catch (err) {
        console.warn(`[REALTIME SSE] Failed to write to client ${id}:`, err);
        this.clients.delete(id);
      }
    }
  }
}

export const realtimeHub = new RealtimeHub();
