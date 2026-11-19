import { expect, test } from '@playwright/test';
import { ChatPage } from '../pages/chat-page.js';

test('two users exchange messages in the chat room', async ({ browser }) => {
  const alice = new ChatPage(await browser.newPage());
  const bruno = new ChatPage(await browser.newPage());

  await Promise.all([alice.goto(), bruno.goto()]);
  await Promise.all([alice.waitUntilConnected(), bruno.waitUntilConnected()]);

  await alice.sendMessage('Alice', 'Hello from Alice');
  await bruno.sendMessage('Bruno', 'Hello from Bruno');

  for (const user of [alice, bruno]) {
    await expect(user.messages).toContainText('Alice');
    await expect(user.messages).toContainText('Hello from Alice');
    await expect(user.messages).toContainText('Bruno');
    await expect(user.messages).toContainText('Hello from Bruno');
  }

  await alice.clearChat();

  await expect(alice.messages).toBeEmpty();
  await expect(alice.emptyMessage).toBeVisible();
  await expect(bruno.messages).toContainText('Hello from Alice');

  await bruno.sendMessage('Bruno', 'A new message after clearing');
  await expect(alice.messages).toContainText('A new message after clearing');
});
