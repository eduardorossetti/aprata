import { useState, useEffect } from 'react'
import Form from './Form'
import List from './List'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'

export default function TelaCadastroCargos() {
  const [exibeTabela, setExibeTabela] = useState(true)
  const [onEdit, setOnEdit] = useState(null)
  const [cargos, setCargos] = useState([])
  const [filtro, setFiltro] = useState('')

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
    getCargos()
  }, [setCargos])

  return exibeTabela ? (
    <List
      cargos={cargos}
      setCargos={setCargos}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
      onEdit={onEdit}
      setOnEdit={setOnEdit}
      cargos={cargos}
      setCargos={setCargos}
      setExibeTabela={setExibeTabela}
    />
  )
}
