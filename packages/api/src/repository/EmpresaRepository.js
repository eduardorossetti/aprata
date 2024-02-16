import Empresa from '../models/Empresa.js'
import PessoaInfo from '../models/Pessoa.js'
import conectar from '../database/mysql/index.js'
import Funcionario from '../models/Funcionario.js'
import Aluno from '../models/Aluno.js'
import Vinculacao from '../models/Vinculacao.js'

export default class EmpresaBD {
  async gravar(empresa) {
    if (empresa instanceof Empresa) {
      const conexao = await conectar()
      let conn = null
      let lastInsertedId = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [responsePessoa] = await conn.query(
          `INSERT INTO pessoa_info (telefone, email, endereco, bairro, cidade, cep, uf) VALUES (?,?,?,?,?,?,?)`,
          [
            empresa.info.telefone,
            empresa.info.email,
            empresa.info.endereco,
            empresa.info.bairro,
            empresa.info.cidade,
            empresa.info.cep,
            empresa.info.uf,
          ],
        )
        const [responseEmpresa] = await conn.query(
          `INSERT INTO empresa (nome, cnpj, ie, proprietario, pessoa_info_codigo) VALUES (?,?,?,?,?)`,
          [
            empresa.nome,
            empresa.cnpj,
            empresa.ie,
            empresa.proprietario,
            responsePessoa.insertId,
          ],
        )

        await conn.commit()

        lastInsertedId = responseEmpresa.insertId
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
      return lastInsertedId
    }
  }

  async atualizar(empresa) {
    if (empresa instanceof Empresa) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query(
          `UPDATE pessoa_info SET telefone=?, email=?, endereco=?, bairro=?, cidade=?, cep=?, uf=? WHERE codigo=?`,
          [
            empresa.info.telefone,
            empresa.info.email,
            empresa.info.endereco,
            empresa.info.bairro,
            empresa.info.cidade,
            empresa.info.cep,
            empresa.info.uf,
            empresa.info.codigo,
          ],
        )

        await conn.query(
          `UPDATE empresa SET nome=?, cnpj=?, ie=?, proprietario=? WHERE codigo=?`,
          [
            empresa.nome,
            empresa.cnpj,
            empresa.ie,
            empresa.proprietario,
            empresa.codigo,
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

  async excluir(empresa) {
    if (empresa instanceof Empresa) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [response] = await conn.query(
          'SELECT pessoa_info_codigo FROM empresa WHERE codigo=?',
          empresa.codigo,
        )

        await conn.query(
          'DELETE FROM empresa WHERE pessoa_info_codigo=?',
          empresa.codigo,
        )

        await conn.query(
          'DELETE FROM pessoa_info WHERE codigo=?',
          response[0].pessoa_info_codigo,
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

  async consultar() {
    const conexao = await conectar()

    const sql = `SELECT
      e.codigo 'codigo_empresa',
      e.nome,
      e.cnpj,
      e.ie,
      e.proprietario,
      i.codigo 'info_codigo',
      i.telefone,
      i.email,
      i.endereco,
      i.bairro,
      i.cidade,
      i.cep,
      i.uf
      FROM pessoa_info i
      JOIN empresa e ON i.codigo = e.pessoa_info_codigo
      GROUP BY e.codigo
      ORDER BY e.nome;`

    const [rows] = await conexao.query(sql)
    const empresas = []

    for (const row of rows) {
      const info = new PessoaInfo(
        row.info_codigo,
        row.telefone,
        row.email,
        row.endereco,
        row.bairro,
        row.cidade,
        row.cep,
        row.uf,
      )

      const empresa = new Empresa(
        row.codigo_empresa,
        row.nome,
        row.cnpj,
        row.ie,
        row.proprietario,
        info,
      )
      empresas.push(empresa)
    }
    return empresas
  }

  async vincularAlunos(empresa, vinculacoes) {
    const conexao = await conectar()
    for (const vinculacao of vinculacoes) {
      const sql =
        'INSERT INTO vinculacao (empresa_codigo, aluno_codigo, data_vinculacao, status) VALUES (?, ?, ?, ?)'
      await conexao.query(sql, [
        empresa.codigo,
        vinculacao.codigoAluno,
        vinculacao.dataVinculacao,
        vinculacao.status,
      ])
    }
  }

  async consultarAlunosNaoVinculados(empresa) {
    const conexao = await conectar()
    const sql = `SELECT 
                        a.codigo 'codigo_aluno',
                        a.nome,
                        a.rg,
                        a.cpf,
                        a.nome_mae,
                        a.data_nascimento,
                        a.escola,
                        a.serie,
                        a.periodo,
                        a.status,
                        a.data_matricula,
                        i.codigo 'codigo_pessoa',
                        i.telefone,
                        i.email,
                        i.endereco,
                        i.bairro,
                        i.cidade,
                        i.cep,
                        i.uf
                    FROM
                        aluno a
                            JOIN 
                        pessoa_info i ON a.pessoa_info_codigo = i.codigo
                    WHERE
                        a.status = '1' AND
                        a.data_matricula IS NOT NULL
                            AND a.codigo NOT IN (SELECT 
                                aluno_codigo
                            FROM
                                vinculacao
                            WHERE
                                empresa_codigo = ?);`
    const [naoVinculados] = await conexao.query(sql, [empresa.codigo])
    const alunos = []
    for (const row of naoVinculados) {
      const info = new PessoaInfo(
        row.codigo_pessoa,
        row.telefone,
        row.email,
        row.endereco,
        row.bairro,
        row.cidade,
        row.cep,
        row.uf,
      )
      const aluno = new Aluno(
        row.codigo_aluno,
        row.nome,
        row.rg,
        row.cpf,
        row.nome_mae,
        row.data_nascimento,
        row.escola,
        row.serie,
        row.periodo,
        row.status,
        info,
        row.data_matricula,
      )
      alunos.push(aluno)
    }
    return alunos
  }

  async consultarAlunos(empresa) {
    const conexao = await conectar()
    const sql = `SELECT 
                      i.codigo "codigo_vinculacao",
                      i.data_vinculacao, 
                      i.status "status_vinculacao",
                      a.codigo 'codigo_aluno',
                      a.nome,
                      a.rg,
                      a.cpf,
                      a.nome_mae,
                      a.data_nascimento,
                      a.escola,
                      a.serie,
                      a.periodo,
                      a.status,
                      a.data_matricula,
                      p.codigo 'codigo_pessoa',
                      p.telefone,
                      p.email,
                      p.endereco,
                      p.bairro,
                      p.cidade,
                      p.cep,
                      p.uf
                FROM vinculacao i 
                JOIN aluno a ON i.aluno_codigo = a.codigo
                LEFT JOIN pessoa_info p ON a.pessoa_info_codigo = p.codigo
                WHERE i.empresa_codigo = ?`
    const [vinculacoes] = await conexao.query(sql, [empresa.codigo])
    const vinculados = []
    for (const row of vinculacoes) {
      const info = new PessoaInfo(
        row.codigo_pessoa,
        row.telefone,
        row.email,
        row.endereco,
        row.bairro,
        row.cidade,
        row.cep,
        row.uf,
      )
      const aluno = new Aluno(
        row.codigo_aluno,
        row.nome,
        row.rg,
        row.cpf,
        row.nome_mae,
        row.data_nascimento,
        row.escola,
        row.serie,
        row.periodo,
        row.status,
        info,
        row.data_matricula,
      )
      const vinculacao = new Vinculacao(
        row.codigo_vinculacao,
        row.data_vinculacao,
        row.status_vinculacao,
        aluno,
      )
      vinculados.push(vinculacao)
    }
    return vinculados
  }

  async atualizarAlunos(vinculacoes) {
    const conexao = await conectar()
    for (const vinculacao of vinculacoes) {
      const sql =
        'UPDATE vinculacao SET data_vinculacao=?, status=? WHERE codigo=?'
      await conexao.query(sql, [
        vinculacao.dataVinculacao,
        vinculacao.status,
        vinculacao.codigoVinculacao,
      ])
    }
  }

  async removerAlunos(vinculacoes) {
    const conexao = await conectar()
    for (const vinculacao of vinculacoes) {
      const sql = 'DELETE FROM vinculacao WHERE codigo=?'
      await conexao.query(sql, [vinculacao.codigoVinculacao])
    }
  }

  async vincularOrientadores(empresa, vinculacoes) {
    const conexao = await conectar()
    for (const vinculacao of vinculacoes) {
      const sql = `INSERT INTO orientador (empresa_codigo, funcionario_codigo, data_vinculacao, status) VALUES (?, ?, ?, ?)`
      await conexao.query(sql, [
        empresa.codigo,
        vinculacao.codigoFuncionario,
        vinculacao.dataVinculacao,
        vinculacao.status,
      ])
    }
  }

  async consultarOrientadoresNaoVinculados(empresa) {
    const conexao = await conectar()
    const sql = `SELECT 
          f.codigo 'codigo_funcionario',
          f.nome,
          f.cpf,
          f.data_nascimento,
          f.status,
          f.nome_usuario,
          f.senha_usuario,
          i.codigo 'codigo_pessoa',
          i.telefone,
          i.email,
          i.endereco,
          i.bairro,
          i.cidade,
          i.cep,
          i.uf
      FROM 
          funcionario f
      JOIN 
          pessoa_info i ON f.pessoa_info_codigo = i.codigo
      JOIN 
          atribuicao a ON f.codigo = a.funcionario_codigo
      JOIN 
          cargo c ON a.cargo_codigo = c.codigo
      WHERE
          f.status = "1" AND
          c.nome = "ORIENTADOR" AND
          f.codigo NOT IN (
              SELECT 
                  funcionario_codigo
              FROM
                  orientador
              WHERE
                  empresa_codigo = ?
          );
    `
    const [rows] = await conexao.query(sql, [empresa.codigo])
    const orientadores = []
    for (const row of rows) {
      const info = new PessoaInfo(
        row.codigo_pessoa,
        row.telefone,
        row.email,
        row.endereco,
        row.bairro,
        row.cidade,
        row.cep,
        row.uf,
      )

      const funcionario = new Funcionario(
        row.codigo_funcionario,
        row.nome,
        row.cpf,
        row.data_nascimento,
        row.status,
        row.nome_usuario,
        row.senha_usuario,
        info,
      )
      orientadores.push(funcionario)
    }
    return orientadores
  }

  async consultarOrientadoresVinculados(empresa) {
    const conexao = await conectar()
    const sql = `SELECT 
          f.codigo 'codigo_funcionario',
          f.nome,
          f.cpf,
          f.data_nascimento,
          f.status,
          f.nome_usuario,
          f.senha_usuario,
          i.codigo 'codigo_pessoa',
          i.telefone,
          i.email,
          i.endereco,
          i.bairro,
          i.cidade,
          i.cep,
          i.uf
      FROM 
          funcionario f
      JOIN 
          pessoa_info i ON f.pessoa_info_codigo = i.codigo
      JOIN 
          atribuicao a ON f.codigo = a.funcionario_codigo
      JOIN 
          cargo c ON a.cargo_codigo = c.codigo
      WHERE
          f.status = "1" AND
          c.nome = "ORIENTADOR" AND
          f.codigo IN (
              SELECT 
                  funcionario_codigo
              FROM
                  orientador
              WHERE
                  empresa_codigo = ?
          );
    `
    const [rows] = await conexao.query(sql, [empresa.codigo])
    const orientadores = []
    for (const row of rows) {
      const info = new PessoaInfo(
        row.codigo_pessoa,
        row.telefone,
        row.email,
        row.endereco,
        row.bairro,
        row.cidade,
        row.cep,
        row.uf,
      )

      const funcionario = new Funcionario(
        row.codigo_funcionario,
        row.nome,
        row.cpf,
        row.data_nascimento,
        row.status,
        row.nome_usuario,
        row.senha_usuario,
        info,
      )
      orientadores.push(funcionario)
    }
    return orientadores
  }

  async atualizarOrientadores(vinculacoes) {
    const connection = await conectar()
    for (const vinculacao of vinculacoes) {
      const sql = `UPDATE orientador SET data_vinculacao=?, status=? WHERE codigo=?`
      await connection.query(sql, [
        vinculacao.dataVinculacao,
        vinculacao.status,
        vinculacao.codigoVinculacao,
      ])
    }
  }

  async removerOrientadores(vinculacoes) {
    const connection = await conectar()
    for (const vinculacao of vinculacoes) {
      const sql = `DELETE FROM orientador where codigo=?`
      await connection.query(sql, [vinculacao.codigoVinculacao])
    }
  }
}
