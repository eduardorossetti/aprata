import Funcionario from '../models/Funcionario.js'
import PessoaInfo from '../models/Pessoa.js'

export default class FuncionarioCTRL {
  gravar(req, res) {
    res.type('application/json')
    if (req.method === 'POST' && req.is('application/json')) {
      const dados = req.body
      const nome = dados.nome
      const cpf = dados.cpf
      const dataNascimento = dados.dataNascimento
      const status = dados.status
      const nomeUsuario = dados.nomeUsuario
      const senhaUsuario = dados.senhaUsuario
      const telefone = dados.info_telefone
      const email = dados.info_email
      const endereco = dados.info_endereco
      const bairro = dados.info_bairro
      const cidade = dados.info_cidade
      const cep = dados.info_cep
      const uf = dados.info_uf
      const atribuicoes = dados.atribuicoes

      if (
        nome &&
        cpf &&
        dataNascimento &&
        status &&
        nomeUsuario &&
        senhaUsuario &&
        telefone &&
        email &&
        endereco &&
        bairro &&
        cidade &&
        cep &&
        uf &&
        atribuicoes
      ) {
        const info = new PessoaInfo(
          null, // codigo
          telefone,
          email,
          endereco,
          bairro,
          cidade,
          cep,
          uf,
        )

        const funcionario = new Funcionario(
          null, // codigo
          nome,
          cpf,
          dataNascimento,
          status,
          nomeUsuario,
          senhaUsuario,
          info,
          atribuicoes,
        )

        funcionario
          .gravar()
          .then((lastInsertedId) => {
            res.status(200).json({
              status: true,
              message: 'Dados gravados com sucesso!',
              id: lastInsertedId,
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      } else {
        res.status(400).json({
          status: false,
          message: 'Dados insuficientes! Consulte a documentação da API.',
        })
      }
    } else {
      res.status(400).json({
        status: false,
        message:
          'Método não permitido ou Funcionario no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  atualizar(req, res) {
    res.type('application/json')
    if (req.method === 'PUT' && req.is('application/json')) {
      const dados = req.body
      const codigoFuncionario = dados.codigo
      const nome = dados.nome
      const cpf = dados.cpf
      const dataNascimento = dados.dataNascimento
      const status = dados.status
      const nomeUsuario = dados.nomeUsuario
      const senhaUsuario = dados.senhaUsuario
      const codigoPessoa = dados.info_codigo
      const telefone = dados.info_telefone
      const email = dados.info_email
      const endereco = dados.info_endereco
      const bairro = dados.info_bairro
      const cidade = dados.info_cidade
      const cep = dados.info_cep
      const uf = dados.info_uf
      const atribuicoes = dados.atribuicoes

      if (
        codigoFuncionario &&
        nome &&
        cpf &&
        dataNascimento &&
        status &&
        nomeUsuario &&
        senhaUsuario &&
        codigoPessoa &&
        telefone &&
        email &&
        endereco &&
        bairro &&
        cidade &&
        cep &&
        uf &&
        atribuicoes
      ) {
        const info = new PessoaInfo(
          codigoPessoa,
          telefone,
          email,
          endereco,
          bairro,
          cidade,
          cep,
          uf,
        )

        const funcionario = new Funcionario(
          codigoFuncionario,
          nome,
          cpf,
          dataNascimento,
          status,
          nomeUsuario,
          senhaUsuario,
          info,
          atribuicoes,
        )

        funcionario
          .atualizar()
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Dados atualizados com sucesso!',
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      } else {
        res.status(400).json({
          status: false,
          message: 'Dados insuficientes! Consulte a documentação da API.',
        })
      }
    } else {
      res.status(400).json({
        status: false,
        message:
          'Método não permitido ou Funcionário no formato JSON não fornecido! Consulte a documentação da API',
      })
    }
  }

  excluir(req, res) {
    const codigo = req.params.codigo
    const funcionario = new Funcionario(codigo)

    funcionario
      .excluir()
      .then(() => {
        res.status(200).json({
          status: true,
          message: 'Dados excluídos com sucesso!',
        })
      })
      .catch((erro) => {
        res.status(500).json({
          status: false,
          message: erro.message,
        })
      })
  }

  consultar(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const funcionario = new Funcionario()
      funcionario
        .consultar()
        .then((funcionarios) => {
          res.status(200).json(funcionarios)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    } else {
      res.status(400).json({
        status: false,
        message: 'Método não permitido! Consulte a documentação da API',
      })
    }
  }

  consultarProfessores(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const funcionario = new Funcionario()
      funcionario
        .consultarProfessores()
        .then((funcionarios) => {
          res.status(200).json(funcionarios)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    } else {
      res.status(400).json({
        status: false,
        message: 'Método não permitido! Consulte a documentação da API',
      })
    }
  }

  consultarOrientadores(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const funcionario = new Funcionario()
      funcionario
        .consultarOrientadores()
        .then((funcionarios) => {
          res.status(200).json(funcionarios)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    } else {
      res.status(400).json({
        status: false,
        message: 'Método não permitido! Consulte a documentação da API',
      })
    }
  }
}
