import { useState, useEffect } from 'react'
import Form from './Form'
import List from './List'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'

export default function TelaCadastroTurmas() {
  const [exibeTabela, setExibeTabela] = useState(true)
  const [onEdit, setOnEdit] = useState(null)
  const [turmas, setTurmas] = useState([])
  const [cursos, setCursos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [filtro, setFiltro] = useState('')

  const getTurmas = async () => {
    try {
      const res = await axios.get(urlBase + '/turmas')
      if (Array.isArray(res.data)) {
        setTurmas(res.data.sort((a, b) => (a.codigo > b.codigo ? 1 : -1)))
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter turmas: ${response.data.message}`)
    }
  }

  const getFuncionarios = async () => {
    try {
      const res = await axios.get(urlBase + '/funcionarios/professores')
      if (Array.isArray(res.data)) {
        setFuncionarios(res.data)
      }
    } catch ({ response }) {
      toast.error(
        `Não foi possível obter funcionários: ${response.data.message}`,
      )
    }
  }

  const getCursos = async () => {
    try {
      const res = await axios.get(urlBase + '/cursos')
      if (Array.isArray(res.data)) {
        setCursos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter cursos: ${response.data.message}`)
    }
  }

  useEffect(() => {
    getTurmas()
    getFuncionarios()
    getCursos()
  }, [setTurmas])

  return exibeTabela ? (
    <List
      turmas={turmas}
      setTurmas={setTurmas}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
      cursos={cursos}
      funcionarios={funcionarios}
      onEdit={onEdit}
      setOnEdit={setOnEdit}
      turmas={turmas}
      setTurmas={setTurmas}
      setExibeTabela={setExibeTabela}
    />
  )
}
