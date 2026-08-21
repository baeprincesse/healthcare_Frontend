// Minimal API wrapper to centralize fetch calls
const API_BASE = '/api'

export async function get(path){
  const res = await fetch(API_BASE + path)
  if(!res.ok) throw new Error('API error')
  return res.json()
}

export async function post(path, body){
  const res = await fetch(API_BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if(!res.ok) throw new Error('API error')
  return res.json()
}

export default { get, post }
