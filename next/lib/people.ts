export async function getSomething() {
  // const res = await fetch("http://localhost:3001/api/users")
  // const people = await res.json();
  let people = [
    {
      "id":1,
      "name":"Jim",
      "family":"Halpert",
      "gender": "male",
      "age": "42",
      "created_at":"2023-05-14T20:56:31.000Z"
    },
    {
      "id":2,
      "name":"Pam",
      "email":"Halpert",
      "gender": "female",
      "age": "39",
      "created_at":"2023-05-14T21:32:23.000Z"
    },
    {
      "id":3,
      "name":"Cecelia",
      "email":"Halpert",
      "gender": "female",
      "age": "5",
      "created_at":"2023-05-14T21:32:23.000Z"
    },
    {
      "id":4,
      "name":"Phillip",
      "email":"Halpert",
      "gender": "male",
      "age": "2",
      "created_at":"2023-05-14T21:32:23.000Z"
    }
  ]
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