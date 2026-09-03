// Mocked auth service; replace with real API integration
export async function login({ email, password }){
  // call backend
  return { name: 'Demo User', email }
}

export async function register({ name, email, phone, password }){
  return { name, email, phone }
}

export default { login, register }
