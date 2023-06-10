export async function getSomething() {
  const res = await fetch("http://localhost:3001/api/users")
  const users = await res.json();
  return(users);
}

export function getAllUserIds() {
  const tmpIds = ["12", "42"]
  return tmpIds.map(tmpId => {
    return {
      params: {
        id: tmpId
      }
    }
  })
}

export async function getUserData(id: string) {
  const res = await fetch("http://localhost:3001/api/users")
  const users = await res.json();
  const name = "temp"
  const email = "temp@temp.uk"
  return {
    id, name, email
  }
}