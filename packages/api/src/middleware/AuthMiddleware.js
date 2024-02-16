import jsonwebtoken from 'jsonwebtoken'

export default function (request, response, next) {
  const bearerToken = request.headers.authorization

  if (!bearerToken) return response.status(401).json()
  try {
    const token = bearerToken.split(' ')[1] // Bearer Token
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    request.headers.user = payload.user
    return next()
  } catch (error) {
    return response.status(401).json()
  }
}
