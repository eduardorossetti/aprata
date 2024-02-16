import { useEffect, useState } from 'react'
import Form from './Form'
import List from './List'
import { urlBase } from '../../utils/definitions.js'
import axios from '../../lib/api'
import { toast } from 'react-toastify'

export default function TelaCadastroFuncionarios() {
  const [exibeTabela, setExibeTabela] = useState(true)
  const [onEdit, setOnEdit] = useState(null)
  const [funcionarios, setFuncionarios] = useState([])
  const [cargos, setCargos] = useState([])
  const [filtro, setFiltro] = useState('')

  const getFuncionarios = async () => {
    try {
      const res = await axios.get(urlBase + '/funcionarios')
      if (Array.isArray(res.data)) {
        setFuncionarios(res.data)
      }
    } catch ({ response }) {
      toast.error(
        `Não foi possível obter funcionários: ${response.data.message}`,
      )
    }
  }

  const getCargos = async () => {
    try {
      const res = await axios.get(urlBase + '/cargos')
      if (Array.isArray(res.data)) {
        setCargos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter cargos: ${response.data.message}`)
    }
  }

  useEffect(() => {
    getFuncionarios()
    getCargos()
  }, [setFuncionarios])

  return exibeTabela ? (
    <List
      funcionarios={funcionarios}
      setFuncionarios={setFuncionarios}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
      cargos={cargos}
      onEdit={onEdit}
      setOnEdit={setOnEdit}
      funcionarios={funcionarios}
      setFuncionarios={setFuncionarios}
      setExibeTabela={setExibeTabela}
    />
  )
}
