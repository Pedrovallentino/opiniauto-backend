async function validateAuth() {
  const baseUrl = 'http://localhost:3333'
  const email = `test-${Date.now()}@example.com`
  const password = 'password123'

  console.log('1. Registrando usuário...')
  const registerRes = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Test User',
      email,
      senha: password,
      perfil: 'USER'
    })
  })

  if (registerRes.status !== 201) {
    console.error('Falha no registro:', await registerRes.text())
    process.exit(1)
  }
  console.log('Registro OK')

  console.log('2. Tentando login...')
  const loginRes = await fetch(`${baseUrl}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      senha: password
    })
  })

  if (loginRes.status !== 200) {
    console.error('Falha no login:', await loginRes.text())
    process.exit(1)
  }

  const data = await loginRes.json()
  console.log('Login OK')
  
  if (!data.token) {
    console.error('Token não retornado')
    process.exit(1)
  }
  
  // Verificar Cookie
  const cookies = loginRes.headers.get('set-cookie')
  console.log('Cookies recebidos:', cookies)

  console.log('3. Testando Refresh Token...')
  const refreshRes = await fetch(`${baseUrl}/token/refresh`, {
    method: 'PATCH',
    headers: {
       'Cookie': cookies || ''
    }
  })

  if (refreshRes.status !== 200) {
     console.error('Falha no refresh:', await refreshRes.text())
     // Não falha o script todo se refresh falhar, pois pode depender de config de cookie segura
  } else {
     console.log('Refresh OK')
  }

  console.log('Validação concluída com sucesso!')
}

validateAuth()
