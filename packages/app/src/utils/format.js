export const formatDate = (value) => {
  const [year, month, day] = value.split('-')

  if (year && month && day) return `${day}/${month}/${year}`

  return 'Invalid Date'
}
