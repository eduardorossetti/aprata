import Empresa from '../models/Empresa.js'
import PessoaInfo from '../models/Pessoa.js'

export default class EmpresaCTRL {
  gravar(req, res) {
    res.type('application/json')
    if (req.method === 'POST' && req.is('application/json')) {
      const dados = req.body
      const nome = dados.nome
      const cnpj = dados.cnpj
      const ie = dados.ie
      const proprietario = dados.proprietario
      const telefone = dados.info_telefone
      const email = dados.info_email
      const endereco = dados.info_endereco
      const bairro = dados.info_bairro
      const cidade = dados.info_cidade
      const cep = dados.info_cep
      const uf = dados.info_uf

      if (
        nome &&
        cnpj &&
        ie &&
        proprietario &&
        telefone &&
        email &&
        endereco &&
        bairro &&
        cidade &&
        cep &&
        uf
      ) {
        const info = new PessoaInfo(
          null,
          telefone,
          email,
          endereco,
          bairro,
          cidade,
          cep,
          uf,
        )

        const empresa = new Empresa(null, nome, cnpj, ie, proprietario, info)

        empresa
          .gravar()
          .then((lastInsertedId) => {
            res.status(200).json({
              status: true,
              message: 'Dados gravados com sucesso.',
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
          'Método não permitido ou Empresa no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  atualizar(req, res) {
    res.type('application/json')
    if (req.method === 'PUT' && req.is('application/json')) {
      const dados = req.body
      const codigoEmpresa = dados.codigo
      const nome = dados.nome
      const cnpj = dados.cnpj
      const ie = dados.ie
      const proprietario = dados.proprietario
      const codigoPessoa = dados.info_codigo
      const telefone = dados.info_telefone
      const email = dados.info_email
      const endereco = dados.info_endereco
      const bairro = dados.info_bairro
      const cidade = dados.info_cidade
      const cep = dados.info_cep
      const uf = dados.info_uf
      if (
        codigoEmpresa &&
        nome &&
        cnpj &&
        ie &&
        proprietario &&
        codigoPessoa &&
        telefone &&
        email &&
        endereco &&
        bairro &&
        cidade &&
        cep &&
        uf
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
        const empresa = new Empresa(
          codigoEmpresa,
          nome,
          cnpj,
          ie,
          proprietario,
          info,
        )
        empresa
          .atualizar()
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Dados atualizados com sucesso.',
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
        message: 'Método não permitido! Consulte a documentação da API.',
      })
    }
  }

  excluir(req, res) {
    const codigo = req.params.codigo
    const empresa = new Empresa(codigo)

    empresa
      .excluir(codigo)
      .then(() => {
        res.status(200).json({
          status: true,
          message: 'Dados excluídos com sucesso.',
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
      const empresa = new Empresa()
      // Método assíncrono que recupera os clientes do banco de dados
      empresa
        .consultar()
        .then((empresas) => {
          res.status(200).json(empresas)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    } else {
      // Código 400 = clientside error
      res.status(400).json({
        status: false,
        message: 'Método não permitido! Consulte a documentação da API.',
      })
    }
  }

  vincularAlunos(req, res) {
    res.type('application/json')
    if (req.method === 'POST') {
      const codigoEmpresa = req.params.codigo
      const vinculacoes = req.body.vinculacoes

      if (codigoEmpresa && vinculacoes && vinculacoes.length > 0) {
        const empresa = new Empresa(codigoEmpresa)
        empresa
          .vincularAlunos(vinculacoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Alunos vinculados com sucesso!',
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      }
    }
  }

  consultarAlunos(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const empresa = new Empresa(req.params.codigo)
      empresa
        .consultarAlunos()
        .then((vinculacoes) => {
          res.status(200).json(vinculacoes)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  consultarAlunosNaoVinculados(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const empresa = new Empresa(req.params.codigo)
      empresa
        .consultarAlunosNaoVinculados()
        .then((vinculacoes) => {
          res.status(200).json(vinculacoes)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  atualizarAlunos(req, res) {
    res.type('application/json')
    if (req.method === 'PUT') {
      const codigoEmpresa = req.params.codigo
      const vinculacoes = req.body.vinculacoes

      if (codigoEmpresa && vinculacoes && vinculacoes.length > 0) {
        const empresa = new Empresa(codigoEmpresa)
        empresa
          .atualizarAlunos(vinculacoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Vinculações atualizadas com sucesso!',
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      }
    }
  }

  removerAlunos(req, res) {
    res.type('application/json')
    if (req.method === 'DELETE') {
      const codigoEmpresa = req.params.codigo
      const vinculacoes = req.body.vinculacoes

      if (codigoEmpresa && vinculacoes && vinculacoes.length > 0) {
        const empresa = new Empresa(codigoEmpresa)
        empresa
          .removerAlunos(vinculacoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Vinculações removidas com sucesso!',
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      }
    }
  }

  vincularOrientadores(req, res) {
    res.type('application/json')
    if (req.method === 'POST') {
      const codigoEmpresa = req.params.codigo
      const vinculacoes = req.body.vinculacoes
      if (codigoEmpresa && vinculacoes && vinculacoes.length > 0) {
        const empresa = new Empresa(codigoEmpresa)
        empresa
          .vincularOrientadores(vinculacoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Orientadores vinculados com sucesso!',
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      }
    }
  }

  consultarOrientadoresNaoVinculados(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const empresa = new Empresa(req.params.codigo)
      empresa
        .consultarOrientadoresNaoVinculados()
        .then((vinculacoes) => {
          res.status(200).json(vinculacoes)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  consultarOrientadoresVinculados(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const empresa = new Empresa(req.params.codigo)
      empresa
        .consultarOrientadoresVinculados()
        .then((vinculacoes) => {
          res.status(200).json(vinculacoes)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  atualizarOrientadores(req, res) {
    res.type('application/json')
    if (req.method === 'PUT') {
      const codigoEmpresa = req.params.codigo
      const vinculacoes = req.body.vinculacoes
      if (codigoEmpresa && vinculacoes && vinculacoes.length > 0) {
        const empresa = new Empresa(codigoEmpresa)
        empresa
          .atualizarOrientadores(vinculacoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Vinculações atualizadas com sucesso!',
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      }
    }
  }

  removerOrientadores(req, res) {
    res.type('application/json')
    if (req.method === 'DELETE') {
      const codigoEmpresa = req.params.codigo
      const vinculacoes = req.body.vinculacoes
      if (codigoEmpresa && vinculacoes && vinculacoes.length > 0) {
        const empresa = new Empresa(codigoEmpresa)
        empresa
          .removerOrientadores(vinculacoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Vinculações removidas com sucesso!',
            })
          })
          .catch((erro) => {
            res.status(500).json({
              status: false,
              message: erro.message,
            })
          })
      }
    }
  }
}
