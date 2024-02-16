import Curso from '../models/Curso.js'

export default class CursoCTRL {
  gravar(req, res) {
    res.type('application/json')
    if (req.method === 'POST' && req.is('application/json')) {
      const { nome, sala, eixo, cargaHoras, status } = req.body

      if (nome && sala && eixo && cargaHoras && status) {
        const curso = new Curso(null, nome, sala, eixo, cargaHoras, status)

        curso
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
          'Método não permitido ou Curso no formato JSON não fornecido! Consulte a documentação da API.',
      })
    }
  }

  atualizar(req, res) {
    res.type('application/json')
    if (req.method === 'PUT' && req.is('application/json')) {
      const { codigo, nome, sala, eixo, cargaHoras, status } = req.body

      if (codigo && nome && sala && eixo && cargaHoras && status) {
        const curso = new Curso(codigo, nome, sala, eixo, cargaHoras, status)

        curso
          .atualizar()
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Dados atualizados com sucesso.',
            })
          })
          .catch((erro) => {
            res.status(500).json(erro)
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

  excluir(req, res) {
    const codigo = req.params.codigo
    const curso = new Curso(codigo)

    curso
      .excluir()
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
      const curso = new Curso()
      curso
        .consultar()
        .then((cursos) => {
          res.status(200).json(cursos)
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
}
