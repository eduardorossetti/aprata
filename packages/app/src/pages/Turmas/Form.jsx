import { Container, Col, Row, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import { toast } from 'react-toastify'
import axios from '../../lib/api'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormTextField from '../../components/Form/form-field'
import FormSelectField from '../../components/Form/form-select-field'
import NewMultiSelect from '../../components/NewMultiSelect/Index'
import CustomModal from '../../components/Modal/Index'

const schema = Yup.object().shape({
  periodo: Yup.string().required('Período é obrigatório'),
  anoLetivo: Yup.number()
    .required('Ano letivo é obrigatório')
    .positive('Precisa ser um número positivo')
    .min(
      new Date().getFullYear(),
      'O valor mínimo não pode ser menor do que o ano atual',
    ),
  cursos: Yup.array()
    .min(1, 'Selecione, no mínimo, um curso')
    .required('Curso é obrigatório'),
  dataInicio: Yup.string().required('Data início é obrigatório'),
  dataFim: Yup.string().required('Data fim é obrigatório'),
  vagas: Yup.number().required('Vagas é obrigatório'),
  funcionarios: Yup.array()
    .min(1, 'Selecione, no mínimo, um professor')
    .required('Funcionário é obrigatório'),
})

const initialValues = {
  codigo: '',
  periodo: '',
  anoLetivo: '',
  cursos: [],
  dataInicio: '',
  dataFim: '',
  vagas: '',
  funcionarios: [],
}

const options = {
  headers: { 'content-type': 'application/json' },
}

export default function FormTurma({
  cursos,
  funcionarios,
  onEdit,
  setExibeTabela,
  setOnEdit,
  turmas,
  setTurmas,
}) {
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (values) => {
    const updatedTurmas = turmas
    if (onEdit) {
      await axios
        .put(`${urlBase}/turmas/`, JSON.stringify(values), options)
        .then((response) => {
          const index = updatedTurmas.findIndex(
            (i) => i.codigo === onEdit.codigo,
          )
          updatedTurmas[index] = values
          setTurmas(updatedTurmas)
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    } else {
      await axios
        .post(`${urlBase}/turmas/`, JSON.stringify(values), options)
        .then((response) => {
          formik.setFieldValue('codigo', response.data.id)
          values.codigo = response.data.id
          updatedTurmas.push(values)
          setTurmas(updatedTurmas)
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
      <Cabecalho2 texto1={'Cadastro'} texto2={'Turma'} />
      <Container
        className="my-4 p-3 overflow-auto"
        style={{ maxHeight: '75vh' }}
      >
        <FormikProvider value={formik}>
          <Row>
            <Col sm={2} md={2} lg={2} className="mb-3">
              <FormTextField
                controlId="formTurma.codigo"
                label="Código"
                name="codigo"
                value={formik.values.codigo}
                isDisabled={true}
              />
            </Col>
          </Row>

          <Row>
            <Col className="mb-3">
              <NewMultiSelect
                controlId="formTurma.cursos"
                name="cursos"
                formRef={formik}
                lista={cursos}
                label={'Cursos'}
                required
              />
            </Col>

            <Col className="mb-3">
              <NewMultiSelect
                controlId="formTurma.funcionarios"
                name="funcionarios"
                formRef={formik}
                lista={funcionarios}
                label={'Professores'}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={4} className="mb-3">
              <FormSelectField
                controlId="formTurma.periodo"
                label="Período"
                name="periodo"
                className="mb-3"
                value={formik.values.periodo}
                required
              >
                <option value="">Selecione um período</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </FormSelectField>
            </Col>

            <Col md={4} className="mb-3">
              <FormTextField
                controlId="formTurma.anoLetivo"
                label="Ano Letivo"
                name="anoLetivo"
                type="number"
                placeholder="Informe o ano letivo"
                value={formik.values.anoLetivo}
                required
              />
            </Col>

            <Col md={4} className="mb-3">
              <FormTextField
                controlId="formTurma.vagas"
                label="Vagas"
                name="vagas"
                placeholder="Informe a quantidade de vagas"
                value={formik.values.vagas}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formTurma.dataInicio"
                label="Data Início"
                name="dataInicio"
                type="date"
                value={formik.values.dataInicio}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formTurma.dataFim"
                label="Data Fim"
                name="dataFim"
                type="date"
                value={formik.values.dataFim}
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
