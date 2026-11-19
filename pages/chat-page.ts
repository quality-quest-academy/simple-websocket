import type { Locator, Page } from '@playwright/test';

export class ChatPage {
  private readonly page: Page;
  private readonly displayName: Locator;
  private readonly message: Locator;
  private readonly sendButton: Locator;
  private readonly clearButton: Locator;
  readonly messages: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.displayName = page.getByLabel('Display name');
    this.message = page.getByLabel('Message', { exact: true });
    this.sendButton = page.getByRole('button', { name: 'Send' });
    this.clearButton = page.getByRole('button', { name: 'Clear chat' });
    this.messages = page.getByRole('log', { name: 'Chat messages' });
    this.emptyMessage = page.getByText('No messages yet.');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async waitUntilConnected(): Promise<void> {
    await this.page.getByRole('status').first().waitFor({ state: 'visible' });
    await this.page.getByRole('status').first().getByText('Connected').waitFor();
  }

  async sendMessage(name: string, text: string): Promise<void> {
    await this.displayName.fill(name);
    await this.message.fill(text);
    await this.sendButton.click();
  }

  async clearChat(): Promise<void> {
    await this.clearButton.click();
  }
}
