// server.ts
import { createServer, IncomingMessage } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';

interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
}

type WSMessage =
  | { type: 'IDENTIFY'; userId: string }
  | { type: 'SEND_SIGNAL'; targetUserId: string };

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const clients = new Map<string, ExtendedWebSocket>();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request: IncomingMessage, socket, head) => {
    const { pathname } = parse(request.url || '');

    if (pathname === '/api/ws') {
      wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
      });
    }
    // FIX: Allow Next.js HMR (Hot Module Replacement) to work
    else if (pathname?.startsWith('/_next/webpack-hmr')) {
      // Do nothing, let Next.js handle this internal socket
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws: ExtendedWebSocket) => {
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', rawData => {
      try {
        const data: WSMessage = JSON.parse(rawData.toString());

        if (data.type === 'IDENTIFY') {
          console.log(`[WS] Registering User: ${data.userId}`);
          ws.userId = data.userId;
          clients.set(data.userId, ws);
        }

        if (data.type === 'SEND_SIGNAL') {
          console.log(
            `[WS] Received Signal from User ${ws.userId} for Target: ${data.targetUserId}`
          );

          const targetWs = clients.get(data.targetUserId);

          if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            console.log(`[WS] SUCCESS: Sending REFRESH_SESSION to Target: ${data.targetUserId}`);
            targetWs.send(JSON.stringify({ type: 'REFRESH_SESSION' }));
          } else {
            console.warn(
              `[WS] FAILED: Target ${data.targetUserId} not found or connection closed.`
            );
            console.log(`[WS] Currently Registered IDs:`, Array.from(clients.keys()));
          }
        }
      } catch (error) {
        console.error('[WS] Failed to parse message:', error);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        console.log(`[WS] User ${ws.userId} disconnected`);
        clients.delete(ws.userId);
      }
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach(client => {
      const ws = client as ExtendedWebSocket;
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
