import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

const host = '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);
const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/chat.js', ['chat.js', 'text/javascript']],
]);

const server = createServer((request, response) => {
  const file = files.get(request.url.split('?')[0]);
  if (request.method !== 'GET' || !file) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const [filename, contentType] = file;
  const body = readFileSync(new URL(`./public/${filename}`, import.meta.url));
  response.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
  response.end(body);
});

const room = new WebSocketServer({ server, path: '/ws', maxPayload: 16 * 1024 });

room.on('connection', (socket) => {
  socket.on('error', (error) => console.error('WebSocket error:', error.message));

  socket.on('message', (data, isBinary) => {
    let message;
    try {
      if (!isBinary) message = JSON.parse(data.toString());
    } catch {
      // A malformed message gets the same response as any other invalid input.
    }

    const name = typeof message?.name === 'string' ? message.name.trim() : '';
    const text = typeof message?.text === 'string' ? message.text.trim() : '';
    if (message?.type !== 'chat' || !name || name.length > 24 || !text || text.length > 500) {
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Send a chat message with a name (1–24 characters) and text (1–500 characters).',
      }));
      return;
    }

    const event = JSON.stringify({ type: 'chat', name, text });
    for (const client of room.clients) {
      if (client.readyState === WebSocket.OPEN) client.send(event);
    }
  });
});

server.listen(port, host, () => {
  console.log(`Chat is running at http://${host}:${server.address().port}`);
});
