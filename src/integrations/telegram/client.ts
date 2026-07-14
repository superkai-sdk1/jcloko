/**
 * Тонкий клиент Telegram Bot API. Без внешних зависимостей — через fetch.
 */
export class TelegramClient {
  private base: string

  constructor(private token: string) {
    this.base = `https://api.telegram.org/bot${token}`
  }

  private async call<T = unknown>(method: string, body?: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${this.base}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = (await res.json()) as { ok: boolean; result?: T; description?: string }
    if (!json.ok) {
      throw new Error(`Telegram ${method}: ${json.description || res.status}`)
    }
    return json.result as T
  }

  getMe() {
    return this.call<{ id: number; username?: string; first_name?: string }>('getMe')
  }

  sendMessage(chatId: string, text: string, opts?: Record<string, unknown>) {
    return this.call<{ message_id: number }>('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
      ...opts,
    })
  }

  sendPhoto(chatId: string, photoUrl: string, caption?: string) {
    return this.call<{ message_id: number }>('sendPhoto', {
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: 'HTML',
    })
  }

  setWebhook(url: string, secretToken: string) {
    return this.call<boolean>('setWebhook', {
      url,
      secret_token: secretToken,
      allowed_updates: ['channel_post', 'edited_channel_post'],
      drop_pending_updates: false,
    })
  }

  deleteWebhook() {
    return this.call<boolean>('deleteWebhook', {})
  }

  getWebhookInfo() {
    return this.call<{ url: string; pending_update_count: number; last_error_message?: string }>(
      'getWebhookInfo',
    )
  }

  getFile(fileId: string) {
    return this.call<{ file_path: string }>('getFile', { file_id: fileId })
  }

  fileUrl(filePath: string): string {
    return `https://api.telegram.org/file/bot${this.token}/${filePath}`
  }
}
