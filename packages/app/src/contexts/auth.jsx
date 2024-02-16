/* eslint-disable camelcase */
import { useState, useEffect, createContext } from 'react'
import axios from '../lib/api'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

const checkToken = (access_token) => {
  try {
    const { user } = jwtDecode(access_token)
    return user
  } catch (error) {
    return null
  }
}

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      navigate('/login')
      return
    }

    axios
      .get(`/auth/access_token`)
      .then((response) => {
        if (response.status === 200) {
          const user = checkToken(access_token)
          if (user) {
            setUser(user)
          } else {
            localStorage.removeItem('access_token')
            navigate('/login')
          }
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching access_token:', error)
        setLoading(false)
      })
  }, [navigate])

  const login = async (usuario, senha) => {
    try {
      const response = await axios.post(`/auth`, { usuario, senha })

      if (response.status === 200) {
        const { access_token } = response.data
        localStorage.setItem('access_token', access_token)
        const user = checkToken(access_token)
        if (user) {
          setUser(user)
          navigate('/')
          toast.success(`Bem-vindo ${usuario}!`)
        } else {
          // Caso o token não possa ser decodificado, trate como erro de login
          // console.error("Token inválido após o login");
          toast.error('Login não foi bem-sucedido. Verifique suas credenciais.')
        }
      } else {
        // Trate outros códigos de status como erro de login
        // console.error("Status de resposta inesperado:", response.status);
        toast.error('Login não foi bem-sucedido. Verifique suas credenciais.')
      }
    } catch (error) {
      // console.error("Erro ao fazer login:", error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.')
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{ authenticated: !!user, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
