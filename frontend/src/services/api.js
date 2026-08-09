/**
 * API SERVICE LAYER
 * ------------------------------------------------------------------
 * This is the ONLY place in the frontend that knows about the real
 * FinacPlus FastAPI backend. Every component reads through here —
 * never through a hardcoded fetch() of its own.
 *
 * Today, this environment runs the FUSE frontend independently of the
 * backend, so every function below tries the real API first and falls
 * back to static, clearly-labeled mock data if the request fails
 * (backend not running, CORS not configured yet, network unreachable).
 *
 * When backend integration happens, nothing outside this file should
 * need to change — the fallback simply stops firing once
 * VITE_API_BASE_URL resolves to a live service.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const MOCK_ACCOUNTS = [
  {
    id: 'ACC-1001',
    customer_name: 'Alex Morgan',
    account_type: 'checking',
    balance: 12500.75,
    currency: 'USD',
  },
  {
    id: 'ACC-1002',
    customer_name: 'Jordan Lee',
    account_type: 'savings',
    balance: 48250.0,
    currency: 'USD',
  },
  {
    id: 'ACC-1003',
    customer_name: 'Riley Chen',
    account_type: 'investment',
    balance: 103780.42,
    currency: 'USD',
  },
]

const MOCK_HEALTH = { status: 'healthy' }

async function request(path, { timeoutMs = 2500 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return { data: await res.json(), source: 'live' }
  } finally {
    clearTimeout(timer)
  }
}

/** GET /health */
export async function getHealth() {
  try {
    return await request('/health')
  } catch {
    return { data: MOCK_HEALTH, source: 'mock' }
  }
}

/** GET /api/accounts */
export async function getAccounts() {
  try {
    return await request('/api/accounts')
  } catch {
    return { data: MOCK_ACCOUNTS, source: 'mock' }
  }
}

export async function getAccount(accountId) {
  try {
    return await request(`/api/accounts/${accountId}`)
  } catch {
    const found = MOCK_ACCOUNTS.find((a) => a.id === accountId)

    if (!found) {
      return {
        data: null,
        source: 'mock',
        error: `Account '${accountId}' not found`,
      }
    }

    return { data: found, source: 'mock' }
  }
}

export const apiConfig = {
  baseUrl: API_BASE_URL,
}
