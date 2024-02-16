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
import { emailRegex } from '../../utils/expressions'
import MaskedFormTextField from '../../components/Form/masked-form-field'
import CustomModal from '../../components/Modal/Index'
import HelpIcon from '../../components/Help/Index'

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  rg: Yup.string().required('RG é obrigatório'),
  cpf: Yup.string().required('CPF é obrigatório'),
  nomeMae: Yup.string().required('Nome da mãe é obrigatório'),
  dataNascimento: Yup.string().required('Data de nascimento é obrigatório'),
  escola: Yup.string().required('Escola é obrigatório'),
  serie: Yup.string().required('Série é obrigatório'),
  periodo: Yup.string().required('Período é obrigatório'),
  status: Yup.string().required('Status é obrigatório'),
  info_telefone: Yup.string().required('Telefone é obrigatório'),
  info_email: Yup.string()
    .required('E-mail é obrigatório')
    .matches(emailRegex, 'Endereço de email inválido'),
  info_endereco: Yup.string().required('Endereço é obrigatório'),
  info_bairro: Yup.string().required('Bairro é obrigatório'),
  info_cidade: Yup.string().required('Cidade é obrigatório'),
  info_cep: Yup.string().required('CEP é obrigatório'),
  info_uf: Yup.string().required('UF é obrigatório'),
})

const initialValues = {
  codigo: '',
  nome: '',
  rg: '',
  cpf: '',
  nomeMae: '',
  dataNascimento: '',
  escola: '',
  serie: '',
  periodo: '',
  status: '',
  info_codigo: '',
  info_telefone: '',
  info_email: '',
  info_endereco: '',
  info_bairro: '',
  info_cidade: '',
  info_cep: '',
  info_uf: '',
}

const options = {
  headers: { 'content-type': 'application/json' },
}

export default function FormAluno({
  onEdit,
  setExibeTabela,
  setOnEdit,
  alunos,
  setAlunos,
}) {
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (values) => {
    const updatedAlunos = alunos
    if (onEdit) {
      await axios
        .put(`${urlBase}/alunos/`, JSON.stringify(values), options)
        .then((response) => {
          const index = updatedAlunos.findIndex(
            (i) => i.codigo === onEdit.codigo,
          )
          updatedAlunos[index] = values
          setAlunos(updatedAlunos)
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    } else {
      await axios
        .post(`${urlBase}/alunos/`, JSON.stringify(values), options)
        .then((response) => {
          formik.setFieldValue('codigo', response.data.id)
          values.codigo = response.data.id
          updatedAlunos.push(values)
          setAlunos(updatedAlunos)
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
        if (key === 'info') {
          for (const key2 in onEdit.info) {
            formik.setFieldValue(`info_${key2}`, onEdit[key][key2])
          }
        } else {
          formik.setFieldValue(key, onEdit[key])
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEdit])

  return (
    <div>
      <Cabecalho2 texto1={'Cadastro'} texto2={'Aluno'} />
      <Container
        className="my-4 p-3 overflow-auto"
        style={{ maxHeight: '75vh' }}
      >
        <FormikProvider value={formik}>
          <Row>
            <Col sm={2} md={2} lg={2} className="mb-3">
              <FormTextField
                controlId="formAluno.codigo"
                label="Código"
                name="codigo"
                isDisabled={true}
              />
            </Col>
            <Col sm={2} md={2} lg={2} className="mb-3">
              <FormTextField
                controlId="formAluno.codigo_pessoa"
                name="info_codigo"
                isDisabled={true}
                type="hidden"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.nome"
                label="Nome"
                name="nome"
                placeholder="Informe o nome do aluno"
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.nomeMae"
                label="Nome da Mãe"
                name="nomeMae"
                placeholder="Informe o nome da mãe do aluno"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <FormSelectField
                controlId="formAluno.status"
                label={
                  <>
                    Status
                    <HelpIcon text="Antes da inativação, confira se ele não está vinculado a alguma empresa/turma!" />
                  </>
                }
                name="status"
                className="mb-3"
                required
              >
                <option value="">Selecione um status</option>
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </FormSelectField>
            </Col>

            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.dataNascimento"
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <MaskedFormTextField
                controlId="formAluno.rg"
                label="RG"
                name="rg"
                format="##.###.###-#"
                mask="_"
                placeholder="Informe o RG do aluno"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <MaskedFormTextField
                controlId="formAluno.cpf"
                label="CPF"
                name="cpf"
                format="###.###.###-##"
                mask="_"
                placeholder="Informe o CPF do aluno"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.endereco"
                label="Endereço"
                name="info_endereco"
                placeholder="Informe o endereço do aluno"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.bairro"
                label="Bairro"
                name="info_bairro"
                placeholder="Informe o bairro do aluno"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.cidade"
                label="Cidade"
                name="info_cidade"
                placeholder="Informe o cidade do aluno"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormSelectField
                controlId="formAluno.uf"
                label="UF"
                name="info_uf"
                required
              >
                <option value="">Selecione</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
                <option value="EX">Estrangeiro</option>
              </FormSelectField>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <MaskedFormTextField
                controlId="formAluno.cep"
                label="CEP"
                name="info_cep"
                format="#####-###"
                mask="_"
                placeholder="Informe a CEP do aluno"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <MaskedFormTextField
                controlId="formAluno.telefone"
                label="Telefone"
                name="info_telefone"
                placeholder="Informe o telefone do aluno"
                format="(##) #####-####"
                mask="_"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.email"
                label="E-mail"
                name="info_email"
                placeholder="Informe o e-mail do aluno"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.escola"
                label="Escola"
                name="escola"
                placeholder="Informe a escola do aluno"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formAluno.serie"
                label="Série"
                name="serie"
                placeholder="Informe a série do aluno"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormSelectField
                controlId="formAluno.periodo"
                label="Período"
                name="periodo"
                className="mb-3"
                required
              >
                <option value="">Selecione um período</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </FormSelectField>
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
