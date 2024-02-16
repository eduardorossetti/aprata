import EmpresaBD from '../repository/EmpresaRepository.js'

export default class Empresa {
  #codigo
  #nome
  #cnpj
  #ie
  #proprietario
  #info

  constructor(codigo, nome, cnpj, ie, proprietario, info) {
    this.#codigo = codigo
    this.#nome = nome
    this.#cnpj = cnpj
    this.#ie = ie
    this.#proprietario = proprietario
    this.#info = info
  }

  get codigo() {
    return this.#codigo
  }

  get nome() {
    return this.#nome
  }

  set nome(novoRazaoSocial) {
    this.#nome = novoRazaoSocial
  }

  get cnpj() {
    return this.#cnpj
  }

  set cnpj(novoCnpj) {
    this.#cnpj = novoCnpj
  }

  get ie() {
    return this.#ie
  }

  set ie(novoIe) {
    this.#ie = novoIe
  }

  get proprietario() {
    return this.#proprietario
  }

  set proprietario(novoProprietario) {
    this.#proprietario = novoProprietario
  }

  get info() {
    return this.#info
  }

  set info(novoPessoaInfo) {
    this.#info = novoPessoaInfo
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      nome: this.#nome,
      cnpj: this.#cnpj,
      ie: this.#ie,
      proprietario: this.#proprietario,
      info: this.#info,
    }
  }

  async gravar() {
    const empresaBD = new EmpresaBD()
    const lastInsertedId = await empresaBD.gravar(this)
    return lastInsertedId
  }

  async atualizar() {
    const empresaBD = new EmpresaBD()
    await empresaBD.atualizar(this)
  }

  async excluir() {
    const empresaBD = new EmpresaBD()
    await empresaBD.excluir(this)
  }

  async consultar() {
    const empresaBD = new EmpresaBD()
    const empresas = await empresaBD.consultar()
    return empresas
  }

  async vincularAlunos(vinculacoes) {
    const vincularAlunos = new EmpresaBD()
    await vincularAlunos.vincularAlunos(this, vinculacoes)
  }

  async atualizarAlunos(vinculacoes) {
    const atualizarAluno = new EmpresaBD()
    await atualizarAluno.atualizarAlunos(vinculacoes)
  }

  async removerAlunos(vinculacoes) {
    const removerAlunos = new EmpresaBD()
    await removerAlunos.removerAlunos(vinculacoes)
  }

  async consultarAlunos() {
    const empresasBD = new EmpresaBD()
    const consultarAlunos = await empresasBD.consultarAlunos(this)
    return consultarAlunos
  }

  async consultarAlunosNaoVinculados() {
    const empresasBD = new EmpresaBD()
    const vinculacoes = await empresasBD.consultarAlunosNaoVinculados(this)
    return vinculacoes
  }

  async vincularOrientadores(vinculacoes) {
    const empresasBD = new EmpresaBD()
    await empresasBD.vincularOrientadores(this, vinculacoes)
  }

  async atualizarOrientadores(vinculacoes) {
    const empresasBD = new EmpresaBD()
    await empresasBD.atualizarOrientadores(vinculacoes)
  }

  async removerOrientadores(vinculacoes) {
    const empresasBD = new EmpresaBD()
    await empresasBD.removerOrientadores(vinculacoes)
  }

  async consultarOrientadoresNaoVinculados() {
    const empresasBD = new EmpresaBD()
    const orientadores =
      await empresasBD.consultarOrientadoresNaoVinculados(this)
    return orientadores
  }

  async consultarOrientadoresVinculados() {
    const empresasBD = new EmpresaBD()
    const orientadores = await empresasBD.consultarOrientadoresVinculados(this)
    return orientadores
  }
}
