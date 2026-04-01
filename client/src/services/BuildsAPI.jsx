const BASE_URL = '/api/builds'

export const getAllBuilds = async () => {
  const response = await fetch(BASE_URL)
  if (!response.ok) throw new Error('Failed to fetch builds')
  return response.json()
}

export const getBuildById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`)
  if (!response.ok) throw new Error('Failed to fetch build')
  return response.json()
}

export const createBuild = async (buildData) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildData)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Failed to create build')
  return data
}

export const updateBuild = async (id, buildData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildData)
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Failed to update build')
  return data
}

export const deleteBuild = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete build')
  return response.json()
}
