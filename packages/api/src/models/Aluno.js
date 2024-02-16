import AlunoBD from '../repository/AlunoRepository.js'

export default class Aluno {
  #codigo
  #nome
  #rg
  #cpf
  #nomeMae
  #dataNascimento
  #escola
  #serie
  #periodo
  #status
  #info
  #dataMatricula

  constructor(
    codigo,
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
    dataMatricula,
  ) {
    this.#codigo = codigo
    this.#nome = nome
    this.#rg = rg
    this.#cpf = cpf
    this.#nomeMae = nomeMae
    this.#dataNascimento = dataNascimento
    this.#escola = escola
    this.#serie = serie
    this.#periodo = periodo
    this.#status = status
    this.#info = info
    this.#dataMatricula = dataMatricula
  }

  get codigo() {
    return this.#codigo
  }

  get nome() {
    return this.#nome
  }

  set nome(nome) {
    this.#nome = nome
  }

  get rg() {
    return this.#rg
  }

  set rg(rg) {
    this.#rg = rg
  }

  get cpf() {
    return this.#cpf
  }

  set cpf(cpf) {
    this.#cpf = cpf
  }

  get nomeMae() {
    return this.#nomeMae
  }

  set nomeMae(nomeMae) {
    this.#nomeMae = nomeMae
  }

  get dataNascimento() {
    return this.#dataNascimento
  }

  set dataNascimento(dataNascimento) {
    this.#dataNascimento = dataNascimento
  }

  get escola() {
    return this.#escola
  }

  set escola(escola) {
    this.#escola = escola
  }

  get serie() {
    return this.#serie
  }

  set serie(serie) {
    this.#serie = serie
  }

  get periodo() {
    return this.#periodo
  }

  set periodo(periodo) {
    this.#periodo = periodo
  }

  get status() {
    return this.#status
  }

  set status(novoStatus) {
    this.#status = novoStatus
  }

  get info() {
    return this.#info
  }

  set info(info) {
    this.#info = info
  }

  get dataMatricula() {
    return this.#dataMatricula
  }

  set dataMatricula(novoDataMatricula) {
    this.#dataMatricula = novoDataMatricula
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      nome: this.#nome,
      rg: this.#rg,
      cpf: this.#cpf,
      nomeMae: this.#nomeMae,
      dataNascimento: this.#dataNascimento,
      escola: this.#escola,
      serie: this.#serie,
      periodo: this.#periodo,
      status: this.#status,
      info: this.#info,
      dataMatricula: this.#dataMatricula,
    }
  }

  async gravar() {
    const alunoBD = new AlunoBD()
    const lastInsertedId = await alunoBD.gravar(this)
    return lastInsertedId
  }

  async atualizar() {
    const alunoBD = new AlunoBD()
    await alunoBD.atualizar(this)
  }

  async excluir() {
    const alunoBD = new AlunoBD()
    await alunoBD.excluir(this)
  }

  async consultar() {
    const alunoBD = new AlunoBD()
    const alunos = await alunoBD.consultar()
    return alunos
  }

  async matricular() {
    const alunoBD = new AlunoBD()
    await alunoBD.matricular(this)
  }

  async consultarNaoMatriculados() {
    const alunoBD = new AlunoBD()
    const alunosNaoMatriculados = await alunoBD.consultarNaoMatriculados()
    return alunosNaoMatriculados
  }

  async consultarMatriculados() {
    const alunoBD = new AlunoBD()
    const alunosMatriculados = await alunoBD.consultarMatriculados()
    return alunosMatriculados
  }

  async gravarRelatorio(relatorio) {
    const alunoBD = new AlunoBD()
    const lastInsertedId = await alunoBD.gravarRelatorio(this, relatorio)
    return lastInsertedId
  }

  async atualizarRelatorio(relatorio) {
    const alunoBD = new AlunoBD()
    await alunoBD.atualizarRelatorio(this, relatorio)
  }

  async excluirRelatorio(codigoRelatorio) {
    const alunoBD = new AlunoBD()
    await alunoBD.excluirRelatorio(codigoRelatorio)
  }

  async consultarRelatorios() {
    const alunoBD = new AlunoBD()
    const relatorios = await alunoBD.consultarRelatorios()
    return relatorios
  }
}
