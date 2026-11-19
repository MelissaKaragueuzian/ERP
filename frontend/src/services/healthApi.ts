import type { HealthResponse } from '../types/health.ts'

export class HealthApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HealthApiError'
  }
}

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL

  if (typeof configured !== 'string' || configured.trim().length === 0) {
    throw new HealthApiError(
      'VITE_API_BASE_URL is not set. Add it to frontend/.env.development, then restart the Vite dev server.',
    )
  }

  return configured.trim().replace(/\/+$/, '')
}

export async function fetchHealth(): Promise<HealthResponse> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}/api/health`
  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new HealthApiError(
      `Cannot reach the API at ${url}. Start the backend and confirm it is listening on that address.`,
    )
  }

  if (!response.ok) {
    throw new HealthApiError(`The API at ${url} returned HTTP ${response.status}.`)
  }

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new HealthApiError(`The API at ${url} did not return JSON.`)
  }

  if (!isHealthResponse(payload)) {
    throw new HealthApiError(`The API at ${url} returned an unexpected health payload.`)
  }

  return payload
}

function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return record.status === 'healthy' && record.application === 'EnterpriseERP'
}
