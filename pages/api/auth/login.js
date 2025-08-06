import jwt from 'jsonwebtoken'

// Usuários para desenvolvimento (sem banco de dados)
const users = [
  {
    id: 1,
    email: 'zeca@beefsync.com',
    password: 'zeca123',
    name: 'Zeca (Proprietário)',
    role: 'OWNER'
  },
  {
    id: 2,
    email: 'bento@fazenda.com',
    password: 'bento123',
    name: 'Bento (Dono)',
    role: 'OWNER'
  },
  {
    id: 3,
    email: 'nilson@fazenda.com',
    password: 'nilson123',
    name: 'Nilson (Gerente)',
    role: 'MANAGER'
  },
  {
    id: 4,
    email: 'admin@beefsync.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'ADMIN'
  }
];

export default async function handler(req, res) {
  console.log('Login request received:', req.body)

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    console.log('Tentando login com:', email)

    // Buscar usuário na lista
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      console.log('Usuário não encontrado:', email)
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    // Verificar senha (comparação simples para desenvolvimento)
    if (user.password !== password) {
      console.log('Senha incorreta para:', email)
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '7d' }
    )

    console.log('Login successful for:', email)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error details:', error)
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message })
  }
}
