/**
 * Тонкий клиент VK API (только нужные методы). Через fetch, без зависимостей.
 */
const API = 'https://api.vk.com/method'
const VERSION = '5.199'

export class VkClient {
  constructor(private token: string) {}

  private async call<T = unknown>(method: string, params: Record<string, string | number>): Promise<T> {
    const body = new URLSearchParams({
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
      access_token: this.token,
      v: VERSION,
    })
    const res = await fetch(`${API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const json = (await res.json()) as { response?: T; error?: { error_msg?: string } }
    if (json.error) throw new Error(`VK ${method}: ${json.error.error_msg || 'error'}`)
    return json.response as T
  }

  /** Проверка токена/сообщества. */
  groupsGetById(groupId?: string) {
    return this.call<Array<{ id: number; name: string; screen_name: string }>>('groups.getById', {
      ...(groupId ? { group_id: groupId } : {}),
    })
  }

  /** Публикация на стене сообщества (owner_id = -groupId, от имени сообщества). */
  wallPost(groupId: string, message: string) {
    return this.call<{ post_id: number }>('wall.post', {
      owner_id: `-${groupId.replace(/^-/, '')}`,
      from_group: 1,
      message,
    })
  }
}
