import Curso from '../models/Curso.js'
import conectar from '../database/mysql/index.js'

export default class CursoBD {
  async gravar(curso) {
    if (curso instanceof Curso) {
      const conexao = await conectar()
      let conn = null
      let lastInsertedId = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [response] = await conn.query(
          'INSERT INTO curso(nome, sala, eixo, carga_horas, status) VALUES (?,?,?,?,?)',
          [curso.nome, curso.sala, curso.eixo, curso.cargaHoras, curso.status],
        )

        await conn.commit()

        lastInsertedId = response.insertId
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
      return lastInsertedId
    }
  }

  async atualizar(curso) {
    if (curso instanceof Curso) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query(
          'UPDATE curso SET nome=?, sala=?, eixo=?, carga_horas=?, status=? WHERE codigo=?',
          [
            curso.nome,
            curso.sala,
            curso.eixo,
            curso.cargaHoras,
            curso.status,
            curso.codigo,
          ],
        )

        await conn.commit()
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
    }
  }

  async excluir(curso) {
    if (curso instanceof Curso) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query('DELETE FROM curso WHERE codigo=?', curso.codigo)

        await conn.commit()
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
    }
  }

  async consultar() {
    const conexao = await conectar()

    const sql = 'SELECT * FROM curso ORDER BY nome ASC'
    const [rows] = await conexao.query(sql)

    const cursos = []
    for (const row of rows) {
      const curso = new Curso(
        row.codigo,
        row.nome,
        row.sala,
        row.eixo,
        row.carga_horas,
        row.status,
      )
      cursos.push(curso)
    }
    return cursos
  }
}
