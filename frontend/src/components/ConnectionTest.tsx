import { useState } from 'react'
import { fetchHealth, HealthApiError } from '../services/healthApi.ts'

type ConnectionState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

export function ConnectionTest() {
  const [state, setState] = useState<ConnectionState>({ kind: 'idle' })

  async function handleTest() {
    setState({ kind: 'loading' })

    try {
      await fetchHealth()
      setState({ kind: 'success' })
    } catch (error) {
      const message =
        error instanceof HealthApiError
          ? error.message
          : 'The API connection failed for an unexpected reason.'
      setState({ kind: 'error', message })
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <button
        type="button"
        onClick={() => {
          void handleTest()
        }}
        disabled={state.kind === 'loading'}
        className="rounded-md bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-wait disabled:bg-blue-800/70"
      >
        Test API Connection
      </button>
      <p className="min-h-6 text-sm leading-6" aria-live="polite">
        {state.kind === 'loading' && <span className="text-slate-600">Contacting the API...</span>}
        {state.kind === 'success' && (
          <span className="font-medium text-blue-800">Backend connected successfully.</span>
        )}
        {state.kind === 'error' && <span className="text-red-700">{state.message}</span>}
        {state.kind === 'idle' && (
          <span className="text-slate-500">Sends GET /api/health to the configured API.</span>
        )}
      </p>
    </div>
  )
}
