import TurmaBD from '../repository/TurmaRepository.js'

export default class Turma {
  #codigo
  #periodo
  #anoLetivo
  #dataInicio
  #dataFim
  #vagas
  #funcionarios
  #cursos
  #inscricoes
  #totalInscricoes

  constructor(
    codigo,
    periodo,
    anoLetivo,
    dataInicio,
    dataFim,
    vagas,
    funcionarios,
    cursos,
  ) {
    this.#codigo = codigo
    this.#periodo = periodo
    this.#anoLetivo = anoLetivo
    this.#dataInicio = dataInicio
    this.#dataFim = dataFim
    this.#vagas = vagas
    this.#funcionarios = funcionarios
    this.#cursos = cursos
  }

  get codigo() {
    return this.#codigo
  }

  set codigo(codigo) {
    this.#codigo = codigo
  }

  get periodo() {
    return this.#periodo
  }

  set periodo(periodo) {
    this.#periodo = periodo
  }

  get anoLetivo() {
    return this.#anoLetivo
  }

  set anoLetivo(anoLetivo) {
    this.#anoLetivo = anoLetivo
  }

  get dataInicio() {
    return this.#dataInicio
  }

  set dataInicio(dataInicio) {
    this.#dataInicio = dataInicio
  }

  get dataFim() {
    return this.#dataFim
  }

  set dataFim(dataFim) {
    this.#dataFim = dataFim
  }

  get vagas() {
    return this.#vagas
  }

  set vagas(vagas) {
    this.#vagas = vagas
  }

  get funcionarios() {
    return this.#funcionarios
  }

  set funcionarios(funcionarios) {
    this.#funcionarios = funcionarios
  }

  get cursos() {
    return this.#cursos
  }

  set cursos(cursos) {
    this.#cursos = cursos
  }

  get inscricoes() {
    return this.#inscricoes
  }

  set inscricoes(novasInscricoes) {
    this.#inscricoes = novasInscricoes
  }

  get totalInscricoes() {
    return this.#totalInscricoes
  }

  set totalInscricoes(novoTotalInscricoes) {
    this.#totalInscricoes = novoTotalInscricoes
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      periodo: this.#periodo,
      anoLetivo: this.#anoLetivo,
      dataInicio: this.#dataInicio,
      dataFim: this.#dataFim,
      vagas: this.#vagas,
      funcionarios: this.#funcionarios,
      cursos: this.#cursos,
      inscricoes: this.#inscricoes,
      totalInscricoes: this.#totalInscricoes,
    }
  }

  async gravar() {
    const turmaBD = new TurmaBD()
    const lastInsertedId = await turmaBD.gravar(this)
    return lastInsertedId
  }

  async atualizar() {
    const turmaBD = new TurmaBD()
    await turmaBD.atualizar(this)
  }

  async excluir() {
    const turmaBD = new TurmaBD()
    await turmaBD.excluir(this)
  }

  async consultar() {
    const turmaBD = new TurmaBD()
    const turmas = await turmaBD.consultar()
    return turmas
  }

  async consultarTurma(codigo) {
    const turmaBD = new TurmaBD()
    const turma = await turmaBD.consultarTurma(codigo)
    return turma
  }

  async inscrever(inscricoes) {
    const turmaBD = new TurmaBD()
    await turmaBD.inscrever(this, inscricoes)
  }

  async atualizarInscricoes(inscricoes) {
    const turmaBD = new TurmaBD()
    await turmaBD.atualizarInscricoes(inscricoes)
  }

  async removerInscricoes(inscricoes) {
    const turmaBD = new TurmaBD()
    await turmaBD.removerInscricoes(inscricoes)
  }

  async consultarInscricoes() {
    const turmaBD = new TurmaBD()
    const inscricoes = await turmaBD.consultarInscricoes(this)
    return inscricoes
  }

  async consultarNaoInscritos() {
    const inscricoesBD = new TurmaBD()
    const inscricoes = await inscricoesBD.consultarNaoInscritos(this)
    return inscricoes
  }

  async gravarFrequencias(frequencias) {
    const turmaBD = new TurmaBD()
    await turmaBD.gravarFrequencias(this, frequencias)
  }

  async atualizarFrequencias(frequencias) {
    const turmaBD = new TurmaBD()
    await turmaBD.atualizarFrequencias(this, frequencias)
  }

  async removerFrequencias(faltas) {
    const turmaBD = new TurmaBD()
    await turmaBD.removerFrequencias(this, faltas)
  }

  async consultarFrequencias() {
    const turmaBD = new TurmaBD()
    const frequencias = await turmaBD.consultarFrequencias(this)
    return frequencias
  }

  async consultarCursos() {
    const turmaBD = new TurmaBD()
    const cursos = await turmaBD.consultarCursos(this)
    return cursos
  }

  async consultarFaltas() {
    const turmaBD = new TurmaBD()
    const faltas = await turmaBD.consultarFaltas(this)
    return faltas
  }
}
