const BASE_URL = '/api/components'

export const getAllComponents = async () => {
  const response = await fetch(BASE_URL)
  if (!response.ok) throw new Error('Failed to fetch components')
  return response.json()
}

export const getComponentsByType = async (type) => {
  const response = await fetch(`${BASE_URL}/${type}`)
  if (!response.ok) throw new Error(`Failed to fetch ${type} components`)
  return response.json()
}
