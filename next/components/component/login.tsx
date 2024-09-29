import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { FormEventHandler, useState } from "react"
import { signIn } from "next-auth/react"

export function Login() {
  const [userInfo, setUserInfo] = useState({email: "", password: ""})
  const handleSubmit:FormEventHandler<HTMLFormElement> = async (e) => {
    // validate your userinfo
    e.preventDefault()
    const res = await signIn('credentials', {
      email: userInfo.email,
      password: userInfo.password,
      callbackUrl: "/"
    })
    console.log(res)
  }
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8 rounded-md shadow bg-background">
      <div className="space-y-2 text-center">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link href="/register" className="font-medium text-primary hover:underline" prefetch={false}>
              register for a new account
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
            placeholder="johndoe@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            value={userInfo.password}
            onChange={({ target }) =>
              setUserInfo({ ...userInfo, password: target.value})
            }
            id="password"
            type="password"
            placeholder="********"
          />
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
      <div className="text-center text-muted-foreground">
        <Link href="#" className="underline underline-offset-4 hover:text-primary" prefetch={false}>
          Forgot your password?
        </Link>
      </div>
    </div>
  )
}
