import Aluno from '../models/Aluno.js'
import PessoaInfo from '../models/Pessoa.js'

export default class AlunoCTRL {
  gravar(req, res) {
    res.type('application/json')
    if (req.method === 'POST' && req.is('application/json')) {
      const dados = req.body
      const nome = dados.nome
      const rg = dados.rg
      const cpf = dados.cpf
      const nomeMae = dados.nomeMae
      const dataNascimento = dados.dataNascimento
      const escola = dados.escola
      const serie = dados.serie
      const periodo = dados.periodo
      const status = dados.status
      const telefone = dados.info_telefone
      const email = dados.info_email
      const endereco = dados.info_endereco
      const bairro = dados.info_bairro
      const cidade = dados.info_cidade
      const cep = dados.info_cep
      const uf = dados.info_uf
      if (
        nome &&
        rg &&
        cpf &&
        nomeMae &&
        dataNascimento &&
        escola &&
        serie &&
        periodo &&
        status &&
        telefone &&
        email &&
        endereco &&
        bairro &&
        cidade &&
        cep &&
        uf
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

        const aluno = new Aluno(
          null, // codigo
          nome,
          rg,
          cpf,
          nomeMae,
          dataNascimento,
          escola,
          serie,
          periodo,
          status,
          info,
        )

        aluno
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
          'Método não permitido ou Aluno no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  atualizar(req, res) {
    res.type('application/json')
    if (req.method === 'PUT' && req.is('application/json')) {
      const dados = req.body
      const codigoAluno = dados.codigo
      const nome = dados.nome
      const rg = dados.rg
      const cpf = dados.cpf
      const nomeMae = dados.nomeMae
      const dataNascimento = dados.dataNascimento
      const escola = dados.escola
      const serie = dados.serie
      const periodo = dados.periodo
      const status = dados.status
      const codigoPessoa = dados.info_codigo
      const telefone = dados.info_telefone
      const email = dados.info_email
      const endereco = dados.info_endereco
      const bairro = dados.info_bairro
      const cidade = dados.info_cidade
      const cep = dados.info_cep
      const uf = dados.info_uf

      if (
        codigoAluno &&
        nome &&
        rg &&
        cpf &&
        nomeMae &&
        dataNascimento &&
        escola &&
        serie &&
        periodo &&
        status &&
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

        const aluno = new Aluno(
          codigoAluno,
          nome,
          rg,
          cpf,
          nomeMae,
          dataNascimento,
          escola,
          serie,
          periodo,
          status,
          info,
        )

        aluno
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
          'Método não permitido ou Aluno no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  excluir(req, res) {
    const codigo = req.params.codigo
    const aluno = new Aluno(codigo)

    aluno
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
      const aluno = new Aluno()
      aluno
        .consultar()
        .then((alunos) => {
          res.status(200).json(alunos)
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
        message: 'Método não permitido! Consulte a documentação da API.',
      })
    }
  }

  matricular(req, res) {
    res.type('application/json')
    if (req.method === 'PUT' && req.is('application/json')) {
      const dados = req.body
      const codigo = dados.codigo

      if (codigo) {
        const aluno = new Aluno(codigo)
        aluno
          .matricular()
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
          'Método não permitido ou Aluno no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  consultarNaoMatriculados(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const aluno = new Aluno()
      aluno
        .consultarNaoMatriculados()
        .then((alunos) => {
          res.status(200).json(alunos)
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
        message: 'Método não permitido! Consulte a documentação da API.',
      })
    }
  }

  consultarMatriculados(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const aluno = new Aluno()
      aluno
        .consultarMatriculados()
        .then((alunos) => {
          res.status(200).json(alunos)
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
        message: 'Método não permitido! Consulte a documentação da API.',
      })
    }
  }

  gravarRelatorio(req, res) {
    res.type('application/json')
    if (req.method === 'POST') {
      const codigoAluno = req.params.codigo
      const relatorio = {
        ...req.body,
        codigoFuncionario: req.headers.user.username,
      }

      if (codigoAluno && relatorio) {
        const aluno = new Aluno(codigoAluno)
        aluno
          .gravarRelatorio(relatorio)
          .then((lastInsertedId) => {
            res.status(200).json({
              status: true,
              message: 'Relatorio gravado com sucesso!',
              id: lastInsertedId,
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

  atualizarRelatorio(req, res) {
    res.type('application/json')
    if (req.method === 'PUT') {
      const codigoAluno = req.params.codigo
      const relatorio = {
        ...req.body,
      }

      if (codigoAluno && relatorio) {
        const aluno = new Aluno(codigoAluno)
        aluno
          .atualizarRelatorio(relatorio)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Relatório atualizado com sucesso!',
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

  excluirRelatorio(req, res) {
    res.type('application/json')
    if (req.method === 'DELETE') {
      const codigoRelatorio = req.params.codigo
      if (codigoRelatorio) {
        const aluno = new Aluno()
        aluno
          .excluirRelatorio(codigoRelatorio)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Relatório excluído com sucesso!',
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

  consultarRelatorios(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const aluno = new Aluno()
      aluno
        .consultarRelatorios()
        .then((relatorios) => {
          res.status(200).json(relatorios)
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
