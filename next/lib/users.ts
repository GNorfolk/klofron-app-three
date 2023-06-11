export async function getSomething() {
  const res = await fetch("https://86tcye7aek.execute-api.eu-west-1.amazonaws.com/api/users")
  const users = await res.json();
  return(users);
}

export function getAllUserIds() {
  const tmpIds = ["42", "420"]
  return tmpIds.map(tmpId => {
    return {
      params: {
        id: tmpId
      }
    }
  })
}

export async function getUserData(id: string) {
  const res = await fetch("https://86tcye7aek.execute-api.eu-west-1.amazonaws.com/api/users/get-user/" + id)
  const user = await res.json();
  const name = user[0].name
  const email = user[0].email
  return {
    id, name, email
  }
}