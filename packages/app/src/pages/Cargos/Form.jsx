import { Container, Col, Row, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import CustomModal from '../../components/Modal/Index'
import FormTextField from '../../components/Form/form-field'
import FormTextAreaField from '../../components/Form/form-textarea'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'
import Cabecalho2 from '../../components/HeaderBelow'

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  descricao: Yup.string().required('Descrição é obrigatório'),
})

const initialValues = {
  codigo: '',
  nome: '',
  descricao: '',
}

const options = {
  headers: { 'content-type': 'application/json' },
}

export default function FormCargo({
  onEdit,
  setExibeTabela,
  setOnEdit,
  cargos,
  setCargos,
}) {
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (values) => {
    const updatedCargos = [...cargos]

    if (onEdit) {
      await axios
        .put(`${urlBase}/cargos/`, JSON.stringify(values), options)
        .then((response) => {
          const index = updatedCargos.findIndex(
            (i) => i.codigo === onEdit.codigo,
          )
          updatedCargos[index] = values
          setCargos(updatedCargos)
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    } else {
      await axios
        .post(`${urlBase}/cargos/`, JSON.stringify(values), options)
        .then((response) => {
          formik.setFieldValue('codigo', response.data.id)
          values.codigo = response.data.id
          updatedCargos.push(values)
          setCargos(updatedCargos)
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    }
    setShowModal(false)
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  })

  const handleBackButton = () => {
    if (onEdit) setOnEdit(null)
    setExibeTabela(true)
  }

  const handleSave = () => {
    setShowModal(true)
  }

  const handleConfirmSave = () => {
    setShowModal(false)
    formik.handleSubmit()
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    if (onEdit) {
      for (const key in onEdit) {
        formik.setFieldValue(key, onEdit[key])
      }
    }
    // eslint-disable-next-line
  }, [onEdit]);

  return (
    <div>
      <Cabecalho2 texto1={'Cadastro'} texto2={'Cargo'} />
      <Container
        className="my-4 p-3 overflow-auto"
        style={{ minHeight: '70vh', maxHeight: '75vh' }}
      >
        <FormikProvider value={formik}>
          <Row>
            <Col sm={2} md={2} lg={2} className="mb-3">
              <FormTextField
                controlId="formCargo.codigo"
                label="Código"
                name="codigo"
                value={formik.values.codigo}
                isDisabled={true}
              />
            </Col>
          </Row>

          <Row>
            <Col className="mb-3">
              <FormTextField
                controlId="formCargo.nome"
                label="Nome"
                name="nome"
                placeholder="Informe o nome do cargo"
                value={formik.values.nome}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col className="mb-3">
              <FormTextAreaField
                controlId="formCargo.descricao"
                label="Descrição"
                name="descricao"
                value={formik.values.descricao}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button
                variant="outline-secondary"
                size="md"
                type="button"
                className="me-2"
                onClick={handleBackButton}
              >
                Voltar
              </Button>
              <Button size="md" onClick={handleSave} type="submit">
                Salvar
              </Button>
            </Col>
          </Row>
        </FormikProvider>
      </Container>
      <CustomModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirmação"
        body="Tem certeza que deseja salvar as informações?"
      />
    </div>
  )
}
