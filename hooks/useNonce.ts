import { headers } from 'next/headers'

export const useNonce = async (): Promise<string | null> => {
  const headersList = await headers()
  return headersList.get('x-nonce')
}

export const getNonce = async (): Promise<string> => {
  const nonce = await useNonce()
  return nonce || ''
} 