import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { FormEventHandler, useState } from "react"
import axios from 'axios'
import { useRouter } from 'next/router'
import { Small } from '../ui/text'

export function Register({ queryClient }) {
  const router = useRouter();
  if (router.isReady) {
    const [userInfo, setUserInfo] = useState({email: "", setPassword: "", retypePassword: ""})
    const handleSubmit:FormEventHandler<HTMLFormElement> = async (e) => {
      // validate your userinfo
      e.preventDefault()
      const res = await axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/user',{
        user_email: userInfo.email,
        user_password: userInfo.setPassword,
        retype_password: userInfo.retypePassword
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-register").innerText = ' '
        router.push("/signin")
      }).catch(error => {
        document.getElementById("cm-register").innerText = error.response.data.message
      })
    }
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-8 rounded-md shadow bg-background">
        <div className="space-y-2 text-center">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">Register a new account</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
              Or{" "}
              <Link href="/signin" className="font-medium text-primary hover:underline" prefetch={false}>
                go back to sign in
              </Link>
            </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={userInfo.email}
              onChange={({ target }) =>
                setUserInfo({ ...userInfo, email: target.value })
              }
              id="email"
              type="text"
              placeholder="johndoe@exmaple.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Set password</Label>
            <Input
              value={userInfo.setPassword}
              onChange={({ target }) =>
                setUserInfo({ ...userInfo, setPassword: target.value})
              }
              id="setPassword"
              type="password"
              placeholder="********"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Retype password</Label>
            <Input
              value={userInfo.retypePassword}
              onChange={({ target }) =>
                setUserInfo({ ...userInfo, retypePassword: target.value})
              }
              id="retypePassword"
              type="password"
              placeholder="********"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
          <div className="text-center text-muted-foreground">
            <Small uid='register'></Small>
          </div>
        </form>
      </div>
    )
  }
}
