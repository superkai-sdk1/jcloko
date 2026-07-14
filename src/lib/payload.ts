import { getPayload } from 'payload'
import config from '@/payload.config'

/** Единый экземпляр Payload для серверных компонентов витрины. */
export const getPayloadClient = async () => getPayload({ config: await config })
