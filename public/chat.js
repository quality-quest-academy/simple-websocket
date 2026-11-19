const status = document.querySelector('#connection-status');
const form = document.querySelector('#chat-form');
const name = document.querySelector('#display-name');
const message = document.querySelector('#message');
const send = document.querySelector('#send');
const messages = document.querySelector('#messages');
const empty = document.querySelector('#empty');
const feedback = document.querySelector('#feedback');

const socketUrl = new URL('/ws', window.location.href);
socketUrl.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(socketUrl);

socket.addEventListener('open', () => {
  status.textContent = 'Connected';
  status.dataset.state = 'connected';
  send.disabled = false;
});

socket.addEventListener('close', () => {
  status.textContent = 'Disconnected';
  status.dataset.state = 'disconnected';
  feedback.textContent = 'Refresh the page to reconnect.';
  send.disabled = true;
});

socket.addEventListener('message', ({ data }) => {
  const event = JSON.parse(data);
  if (event.type === 'error') {
    feedback.textContent = event.message;
    return;
  }
  if (event.type !== 'chat') return;

  empty.hidden = true;
  const item = document.createElement('li');
  const author = document.createElement('strong');
  author.textContent = event.name;
  const body = document.createElement('p');
  body.textContent = event.text;
  item.append(author, body);
  messages.append(item);
  item.scrollIntoView({ block: 'nearest' });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (socket.readyState !== WebSocket.OPEN) return;

  const displayName = name.value.trim();
  const text = message.value.trim();
  if (!displayName || !text) {
    feedback.textContent = 'Enter a display name and a message.';
    (displayName ? message : name).focus();
    return;
  }

  socket.send(JSON.stringify({ type: 'chat', name: displayName, text }));
  feedback.textContent = '';
  message.value = '';
  message.focus();
});
