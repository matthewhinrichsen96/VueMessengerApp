export async function fetchChats()
{
  const response = await fetch('http://localhost:3001/StaticUsers')

  if (!response.ok) {
    throw new Error(`Error executing command: ${response.statusText}`)
  }
  const data = await response.json()

  return data.users
}

export async function fetchTeams()
{
  const response = await fetch('http://localhost:3001/Teams')

  if (!response.ok) {
    throw new Error(`Error executing command: ${response.statusText}`)
  }
  const data = await response.json()

  return data.Teams
}