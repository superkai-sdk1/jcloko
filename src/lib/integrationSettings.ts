import { getPayloadClient } from './payload'

export type TelegramSettings = {
  enabled?: boolean | null
  botToken?: string | null
  channelId?: string | null
  crosspostOnPublish?: boolean | null
}
export type VkSettings = {
  enabled?: boolean | null
  accessToken?: string | null
  groupId?: string | null
  confirmationToken?: string | null
  crosspostOnPublish?: boolean | null
}
export type IntegrationSettingsShape = {
  telegram?: TelegramSettings
  vk?: VkSettings
  deduplication?: {
    enabled?: boolean | null
    timeWindowMinutes?: number | null
    similarityThreshold?: number | null
    reviewLowerBound?: number | null
  }
}

/**
 * Внутреннее чтение IntegrationSettings (read=admin в API, поэтому серверный код
 * читает через local API с overrideAccess, минуя ролевой доступ).
 */
export const getIntegrationSettings = async (): Promise<IntegrationSettingsShape> => {
  const payload = await getPayloadClient()
  const g = await payload.findGlobal({ slug: 'integration-settings', overrideAccess: true, depth: 0 })
  return (g ?? {}) as IntegrationSettingsShape
}
