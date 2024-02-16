export default function (roles = []) {
  return function (request, response, next) {
    if (
      request.headers.user.roles.findIndex((role) => roles.includes(role)) !==
      -1
    )
      return next()

    return response.status(403).json()
  }
}
