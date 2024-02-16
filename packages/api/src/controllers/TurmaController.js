import Turma from '../models/Turma.js'

export default class TurmaCTRL {
  gravar(req, res) {
    res.type('application/json')
    if (req.method === 'POST' && req.is('application/json')) {
      const {
        periodo,
        anoLetivo,
        dataInicio,
        dataFim,
        vagas,
        funcionarios,
        cursos,
      } = req.body

      if (
        periodo &&
        anoLetivo &&
        dataInicio &&
        dataFim &&
        vagas &&
        funcionarios &&
        cursos
      ) {
        const turma = new Turma(
          null, // codigo
          periodo,
          anoLetivo,
          dataInicio,
          dataFim,
          vagas,
          funcionarios,
          cursos,
        )

        turma
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
          'Método não permitido ou Turma no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  atualizar(req, res) {
    res.type('application/json')
    if (req.method === 'PUT' && req.is('application/json')) {
      const {
        codigo,
        periodo,
        anoLetivo,
        dataInicio,
        dataFim,
        vagas,
        funcionarios,
        cursos,
      } = req.body

      if (
        codigo &&
        periodo &&
        anoLetivo &&
        dataInicio &&
        dataFim &&
        vagas &&
        funcionarios &&
        cursos
      ) {
        const turma = new Turma(
          codigo,
          periodo,
          anoLetivo,
          dataInicio,
          dataFim,
          vagas,
          funcionarios,
          cursos,
        )

        turma
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
        message:
          'Método não permitido ou Turma no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  excluir(req, res) {
    const codigo = req.params.codigo
    const turma = new Turma(codigo)

    turma
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
      const turma = new Turma()
      turma
        .consultar()
        .then((turmas) => {
          res.status(200).json(turmas)
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

  consultarTurma(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const codigo = req.params.codigo
      const turma = new Turma(codigo)
      turma
        .consultarTurma(codigo)
        .then((turma) => {
          res.status(200).json(turma)
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

  inscrever(req, res) {
    res.type('application/json')
    if (req.method === 'POST') {
      const codigoTurma = req.params.codigo
      const inscricoes = req.body.inscricoes

      if (codigoTurma && inscricoes && inscricoes.length > 0) {
        const turma = new Turma(codigoTurma)
        turma
          .inscrever(inscricoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Alunos inscritos com sucesso!',
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

  consultarInscricoes(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const turma = new Turma(req.params.codigo)
      turma
        .consultarInscricoes()
        .then((inscricoes) => {
          res.status(200).json(inscricoes)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  consultarNaoInscritos(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const turma = new Turma(req.params.codigo)
      turma
        .consultarNaoInscritos()
        .then((inscricoes) => {
          res.status(200).json(inscricoes)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  atualizarInscricoes(req, res) {
    res.type('application/json')
    if (req.method === 'PUT') {
      const codigoTurma = req.params.codigo
      const inscricoes = req.body.inscricoes

      if (codigoTurma && inscricoes && inscricoes.length > 0) {
        const turma = new Turma(codigoTurma)
        turma
          .atualizarInscricoes(inscricoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Inscrições atualizadas com sucesso!',
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

  removerInscricoes(req, res) {
    res.type('application/json')
    if (req.method === 'DELETE') {
      const codigoTurma = req.params.codigo
      const inscricoes = req.body.inscricoes

      if (codigoTurma && inscricoes && inscricoes.length > 0) {
        const turma = new Turma(codigoTurma)
        turma
          .removerInscricoes(inscricoes)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Inscrições removidas com sucesso!',
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

  gravarFrequencias(req, res) {
    res.type('application/json')
    if (req.method === 'POST') {
      const codigoTurma = req.params.codigo
      const frequencias = req.body.frequencias

      if (codigoTurma && frequencias && frequencias.length > 0) {
        const turma = new Turma(codigoTurma)
        turma
          .gravarFrequencias(frequencias)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Frequências gravadas com sucesso!',
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

  consultarFrequencias(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const turma = new Turma(req.params.codigo)
      turma
        .consultarFrequencias()
        .then((frequencias) => {
          res.status(200).json(frequencias)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  atualizarFrequencias(req, res) {
    res.type('application/json')
    if (req.method === 'PUT') {
      const codigoTurma = req.params.codigo
      const frequencias = req.body.frequencias

      if (codigoTurma && frequencias && frequencias.length > 0) {
        const turma = new Turma(codigoTurma)
        turma
          .atualizarFrequencias(frequencias)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Frequências atualizadas com sucesso!',
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

  removerFrequencias(req, res) {
    res.type('application/json')
    if (req.method === 'DELETE') {
      const codigoTurma = req.params.codigo
      const faltas = req.body.faltas

      if (codigoTurma && faltas && faltas.length > 0) {
        const turma = new Turma(codigoTurma)
        turma
          .removerFrequencias(faltas)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Frequências removidas com sucesso!',
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

  consultarCursos(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const turma = new Turma(req.params.codigo)
      turma
        .consultarCursos()
        .then((cursos) => {
          res.status(200).json(cursos)
        })
        .catch((erro) => {
          res.status(500).json({
            status: false,
            message: erro.message,
          })
        })
    }
  }

  consultarFaltas(req, res) {
    res.type('application/json')
    if (req.method === 'GET') {
      const turma = new Turma(req.params.codigo)
      turma
        .consultarFaltas()
        .then((faltas) => {
          res.status(200).json(faltas)
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
