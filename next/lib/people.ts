export async function getSomething() {
  const res = await fetch("http://localhost:3001/api/people")
  const people = await res.json();
  return(people);
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
  const res = await fetch("http://localhost:3001/api/users/get-user/" + id)
  const user = await res.json();
  const name = user[0].name
  const email = user[0].email
  return {
    id, name, email
  }
}