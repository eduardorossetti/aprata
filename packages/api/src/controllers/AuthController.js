import jsonwebtoken from 'jsonwebtoken'
import Funcionario from '../models/Funcionario.js'
import { StatusCodes } from 'http-status-codes'

export default class AuthCtrl {
  async autenticar(req, res) {
    const { usuario, senha } = req.body

    try {
      if (!usuario || !senha) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Usuário ou senha inválidos!' })
      }

      const funcionario = new Funcionario()
      const user = await funcionario.autenticar(usuario, senha)

      if (user) {
        const accessToken = jsonwebtoken.sign(
          { user },
          process.env.JWT_SECRET,
          { expiresIn: '60m' },
        )
        return res.status(StatusCodes.OK).json({ access_token: accessToken })
      }

      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Usuário ou senha inválidos!' })
    } catch (error) {
      console.error(error)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno!' })
    }
  }

  async access_token(req, res) {
    const bearerToken = req.headers.authorization

    try {
      const accessToken = bearerToken.split(' ')[1]
      // const payload = jsonwebtoken.verify(accessToken, process.env.JWT_SECRET)

      return res.status(StatusCodes.OK).json({ access_token: accessToken })
    } catch (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Token inválido!' })
    }
  }
}
