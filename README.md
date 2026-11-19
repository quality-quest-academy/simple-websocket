# WebSockets Demo

A local chat room built with Node.js, `ws`, and the browser's WebSocket API.

## Run locally

Install Node.js and run these commands from this project folder.

```sh
npm ci
npm start
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in two tabs. Wait for **Connected**, enter a display name in each tab, and send a message. Both tabs should show it. A refreshed tab starts with an empty conversation. Press `Ctrl+C` in the terminal to stop the server.

## WebSocket messages

Connect to `ws://127.0.0.1:3000/ws` and send a text frame containing JSON.

```json
{"type":"chat","name":"Ada","text":"Hello from Bruno!"}
```

The server trims `name` and `text` and broadcasts the same object to every connected client, including the sender. Use a name of 1–24 characters and a message of 1–500 characters. For malformed JSON or an invalid message, the sender gets an object with `type: "error"` and a `message` string. Frames over 16 KiB close the connection.

Open the `bruno` folder as a collection in Bruno while the server is running. It includes a valid chat message and an invalid message to demonstrate the error response.
