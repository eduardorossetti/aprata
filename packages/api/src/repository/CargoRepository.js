import Cargo from '../models/Cargo.js'
import conectar from '../database/mysql/index.js'

export default class CargoBD {
  async gravar(cargo) {
    if (cargo instanceof Cargo) {
      const conexao = await conectar()
      let conn = null
      let lastInsertedId = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [response] = await conn.query(
          'INSERT INTO cargo(nome,descricao) VALUES (?,?)',
          [cargo.nome, cargo.descricao],
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

  async alterar(cargo) {
    if (cargo instanceof Cargo) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query(
          'UPDATE cargo SET nome=?, descricao=? WHERE codigo=?',
          [cargo.nome, cargo.descricao, cargo.codigo],
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

  async excluir(cargo) {
    if (cargo instanceof Cargo) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query('DELETE FROM cargo WHERE codigo=?', cargo.codigo)
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

    const sql = `SELECT * FROM cargo ORDER BY cargo.nome`

    const [rows] = await conexao.query(sql)

    const cargos = []
    for (const row of rows) {
      const cargo = new Cargo(row.codigo, row.nome, row.descricao)

      cargos.push(cargo)
    }
    return cargos
  }
}
