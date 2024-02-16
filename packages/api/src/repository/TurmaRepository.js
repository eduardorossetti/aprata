import Curso from '../models/Curso.js'
import Funcionario from '../models/Funcionario.js'
import Turma from '../models/Turma.js'
import conectar from '../database/mysql/index.js'
import PessoaInfo from '../models/Pessoa.js'
import Aluno from '../models/Aluno.js'
import Inscricao from '../models/Inscricao.js'
import Frequencia from '../models/Frequencia.js'

export default class TurmaBD {
  async gravar(turma) {
    if (turma instanceof Turma) {
      const conexao = await conectar()
      let conn = null
      let lastInsertedId = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [turmaBD] = await conn.query(
          'INSERT INTO turma(periodo, ano_letivo, data_inicio, data_fim, vagas) VALUES (?,?,?,?,?)',
          [
            turma.periodo,
            turma.anoLetivo,
            turma.dataInicio,
            turma.dataFim,
            turma.vagas,
          ],
        )

        for (const funcionario of turma.funcionarios) {
          await conn.query(
            'INSERT INTO turma_funcionario (turma_codigo, funcionario_codigo) VALUES (?, ?)',
            [turmaBD.insertId, funcionario.codigo],
          )
        }

        for (const curso of turma.cursos) {
          await conn.query(
            'INSERT INTO turma_curso (turma_codigo, curso_codigo) VALUES (?, ?)',
            [turmaBD.insertId, curso.codigo],
          )
        }

        await conn.commit()

        lastInsertedId = turmaBD.insertId
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
      return lastInsertedId
    }
  }

  async atualizar(turma) {
    if (turma instanceof Turma) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        // 1 - atualizar turma, 2 - atualizar turma_funcionario, 3 - atualizar turma_curso

        await conn.query(
          'UPDATE turma SET periodo=?, ano_letivo=?, data_inicio=?, data_fim=?, vagas=? WHERE codigo=?',
          [
            turma.periodo,
            turma.anoLetivo,
            turma.dataInicio,
            turma.dataFim,
            turma.vagas,
            turma.codigo,
          ],
        )

        await conn.query('DELETE FROM turma_funcionario WHERE turma_codigo=?', [
          turma.codigo,
        ])

        for (const funcionario of turma.funcionarios) {
          await conn.query(
            'INSERT INTO turma_funcionario (turma_codigo, funcionario_codigo) VALUES (?, ?)',
            [turma.codigo, funcionario.codigo],
          )
        }

        await conn.query('DELETE FROM turma_curso WHERE turma_codigo=?', [
          turma.codigo,
        ])

        for (const curso of turma.cursos) {
          await conn.query(
            'INSERT INTO turma_curso (turma_codigo, curso_codigo) VALUES (?, ?)',
            [turma.codigo, curso.codigo],
          )
        }

        await conn.commit()
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
    }
  }

  async excluir(turma) {
    if (turma instanceof Turma) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query(
          'DELETE FROM turma_curso WHERE turma_codigo=?',
          turma.codigo,
        )

        await conn.query(
          'DELETE FROM turma_funcionario WHERE turma_codigo=?',
          turma.codigo,
        )

        await conn.query('DELETE FROM turma WHERE codigo=?', turma.codigo)

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
                    t.*,
                    CONCAT('[',
                        GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo',
                                    f.codigo,
                                    'nome',
                                    f.nome)),
                        ']') AS funcionarios,
                    CONCAT('[',
                        GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo',
                                    c.codigo,
                                    'nome',
                                    c.nome)),
                        ']') AS cursos
                FROM
                    turma t
                        LEFT JOIN
                    turma_funcionario tf ON t.codigo = tf.turma_codigo
                        LEFT JOIN
                    funcionario f ON tf.funcionario_codigo = f.codigo
                        LEFT JOIN
                    turma_curso tc ON t.codigo = tc.turma_codigo
                        LEFT JOIN
                    curso c ON tc.curso_codigo = c.codigo
                GROUP BY t.codigo;`

    const [response] = await conexao.query(sql)

    const turmas = []

    for (const row of response) {
      const funcionarios = []
      const cursos = []

      for (const item of JSON.parse(row.funcionarios)) {
        const funcionario = new Funcionario(item.codigo, item.nome)
        funcionarios.push(funcionario)
      }

      for (const item of JSON.parse(row.cursos)) {
        const curso = new Curso(item.codigo, item.nome)
        cursos.push(curso)
      }

      const turma = new Turma(
        row.codigo,
        row.periodo,
        row.ano_letivo,
        row.data_inicio,
        row.data_fim,
        row.vagas,
        funcionarios,
        cursos,
      )
      turmas.push(turma)
    }
    return turmas
  }

  async consultarTurma(codigo) {
    const conexao = await conectar()
    const sql = `SELECT 
                    t.*,
                    CONCAT('[',
                        GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo',
                                    f.codigo,
                                    'nome',
                                    f.nome)),
                        ']') AS funcionarios,
                    CONCAT('[',
                        GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo',
                                    c.codigo,
                                    'nome',
                                    c.nome)),
                        ']') AS cursos
                FROM
                    turma t
                        LEFT JOIN
                    turma_funcionario tf ON t.codigo = tf.turma_codigo
                        LEFT JOIN
                    funcionario f ON tf.funcionario_codigo = f.codigo
                        LEFT JOIN
                    turma_curso tc ON t.codigo = tc.turma_codigo
                        LEFT JOIN
                    curso c ON tc.curso_codigo = c.codigo
                WHERE t.codigo = ?
                GROUP BY t.codigo;`

    const [response] = await conexao.query(sql, [codigo])
    const funcionarios = []
    const cursos = []
    for (const item of JSON.parse(response[0].funcionarios)) {
      const funcionario = new Funcionario(item.codigo, item.nome)
      funcionarios.push(funcionario)
    }
    for (const item of JSON.parse(response[0].cursos)) {
      const curso = new Curso(item.codigo, item.nome)
      cursos.push(curso)
    }
    const turma = new Turma(
      response[0].codigo,
      response[0].periodo,
      response[0].ano_letivo,
      response[0].data_inicio,
      response[0].data_fim,
      response[0].vagas,
      funcionarios,
      cursos,
    )
    return turma
  }

  async inscrever(turma, inscricoes) {
    const conexao = await conectar()
    for (const inscricao of inscricoes) {
      const sql =
        'INSERT INTO inscricao (turma_codigo, aluno_codigo, data_inscricao, status) VALUES (?, ?, ?, ?)'
      await conexao.query(sql, [
        turma.codigo,
        inscricao.codigoAluno,
        inscricao.dataInscricao,
        inscricao.status,
      ])
    }
  }

  async consultarNaoInscritos(turma) {
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
                                inscricao
                            WHERE
                                turma_codigo = ?);`
    const [naoInscritos] = await conexao.query(sql, [turma.codigo])
    const alunos = []
    for (const row of naoInscritos) {
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

  async consultarInscricoes(turma) {
    const conexao = await conectar()
    const sql = `SELECT 
                  i.codigo AS codigo_inscricao,
                  i.data_inscricao, 
                  i.status AS status_inscricao,
                  a.codigo AS codigo_aluno,
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
                  p.codigo AS codigo_pessoa,
                  p.telefone,
                  p.email,
                  p.endereco,
                  p.bairro,
                  p.cidade,
                  p.cep,
                  p.uf
              FROM 
                  inscricao i 
              JOIN 
                  aluno a ON i.aluno_codigo = a.codigo
              LEFT JOIN 
                  pessoa_info p ON a.pessoa_info_codigo = p.codigo
              WHERE 
                  i.turma_codigo = ?
              ORDER BY 
                  a.nome ASC;
              `

    const [inscricoes] = await conexao.query(sql, [turma.codigo])
    const inscritos = []
    for (const row of inscricoes) {
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

      const inscricao = new Inscricao(
        row.codigo_inscricao,
        row.data_inscricao,
        row.status_inscricao,
        aluno,
      )
      inscritos.push(inscricao)
    }

    return inscritos
  }

  async atualizarInscricoes(inscricoes) {
    const conexao = await conectar()
    for (const inscricao of inscricoes) {
      const sql =
        'UPDATE inscricao SET data_inscricao=?, status=? WHERE codigo=?'
      await conexao.query(sql, [
        inscricao.dataInscricao,
        inscricao.status,
        inscricao.codigoInscricao,
      ])
    }
  }

  async removerInscricoes(inscricoes) {
    const conexao = await conectar()
    for (const inscricao of inscricoes) {
      const sql = 'DELETE FROM inscricao WHERE codigo=?'
      await conexao.query(sql, [inscricao.codigoInscricao])
    }
  }

  async gravarFrequencias(turma, frequencias) {
    const conexao = await conectar()
    for (const frequencia of frequencias) {
      const sql =
        'INSERT INTO frequencia (turma_codigo, aluno_codigo, curso_codigo, data_falta) VALUES (?, ?, ?, ?)'
      await conexao.query(sql, [
        turma.codigo,
        frequencia.codigoAluno,
        frequencia.curso,
        frequencia.dataFalta,
      ])
    }
  }

  async atualizarFrequencias(turma, frequencias) {
    const conexao = await conectar()
    for (const frequencia of frequencias) {
      const sql =
        'UPDATE frequencia SET data_falta=? WHERE turma_codigo=? AND aluno_codigo=? AND curso_codigo=?'
      await conexao.query(sql, [
        frequencia.data,
        turma.codigo,
        frequencia.codigoAluno,
        frequencia.codigoCurso,
      ])
    }
  }

  async removerFrequencias(turma, faltas) {
    const conexao = await conectar()
    for (const falta of faltas) {
      const sql = 'DELETE FROM frequencia WHERE codigo=?'
      await conexao.query(sql, [falta.codigo])
    }
  }

  async consultarFrequencias(turma) {
    const conexao = await conectar()
    const sql = `SELECT 
                        f.data_falta,
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
                FROM frequencia f 
                JOIN aluno a ON f.aluno_codigo = a.codigo
                LEFT JOIN pessoa_info p ON a.pessoa_info_codigo = p.codigo
                WHERE f.turma_codigo = ?`

    const [frequencias] = await conexao.query(sql, [turma.codigo])
    const frequenciasTurma = []
    for (const row of frequencias) {
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

      const frequencia = new Frequencia(row.data_falta, aluno, row.codigoCurso)
      frequenciasTurma.push(frequencia)
    }

    return frequenciasTurma
  }

  async consultarCursos(turma) {
    const conexao = await conectar()
    const sql = `SELECT 
                    t.codigo AS CodigoTurma,
                    t.periodo AS PeriodoTurma,
                    t.ano_letivo AS AnoLetivo,
                    c.codigo AS CodigoCurso,
                    c.nome AS NomeCurso,
                    c.sala AS SalaCurso
                FROM 
                    turma t
                JOIN 
                    turma_curso tc ON t.codigo = tc.turma_codigo
                JOIN 
                    curso c ON tc.curso_codigo = c.codigo
                WHERE 
                    t.codigo = ?;`

    const [cursos] = await conexao.query(sql, [turma.codigo])
    const cursosTurma = []
    for (const row of cursos) {
      const curso = new Curso(
        row.CodigoCurso,
        row.NomeCurso,
        row.SalaCurso,
        row.CodigoTurma,
        row.PeriodoTurma,
        row.AnoLetivo,
      )
      cursosTurma.push(curso)
    }

    return cursosTurma
  }

  async consultarFaltas(turma) {
    const conexao = await conectar()
    const sql = `SELECT 
                  f.codigo,
                  f.data_falta,
                  t.codigo 'codigo_turma',
                  c.nome 'nome_curso',
                  a.codigo 'codigo_aluno',
                  a.nome 'nome_aluno',
                  a.rg,
                  a.cpf,
                  a.nome_mae,
                  a.data_nascimento,
                  a.escola,
                  a.serie,
                  a.periodo,
                  a.status,
                  a.data_matricula
              FROM 
                  frequencia f
              INNER JOIN 
                  aluno a ON f.aluno_codigo = a.codigo
              INNER JOIN 
                  curso c ON f.curso_codigo = c.codigo
              INNER JOIN 
                  turma t ON f.turma_codigo = t.codigo
              WHERE 
                  t.codigo = ?
              ORDER BY
                f.data_falta DESC;
                `
    const [rows] = await conexao.query(sql, [turma.codigo])
    const faltas = []
    for (const row of rows) {
      const aluno = new Aluno(
        row.codigo_aluno,
        row.nome_aluno,
        row.rg,
        row.cpf,
        row.nome_mae,
        row.data_nascimento,
        row.escola,
        row.serie,
        row.periodo,
        row.status,
        row.data_matricula,
      )
      const frequencia = new Frequencia(
        row.codigo,
        row.codigo_turma,
        aluno,
        row.nome_curso,
        row.data_falta,
      )
      faltas.push(frequencia)
    }
    return faltas
  }
}
