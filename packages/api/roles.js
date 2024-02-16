export const roles = {
  Administrativo: ['Administrativo'],
  Professor: ['Professor', 'Administrativo'],
  Orientador: ['Orientador', 'Administrativo'],
}

// Regra Administrativo: usuários coom cargo Administrativo tem acesso
// Regra Professor: usuários com cargo de Professor ou Administrativo tem acesso.
// Regra Orientador: usuários com cargo de Orientador ou Administrativo tem acesso.
