import { NextPage } from 'next'
import { FormEventHandler, useState } from 'react'
import { signIn } from "next-auth/react"

interface Props {}

const SignIn: NextPage = (props) : JSX.Element => {
    const [userInfo, setUserInfo] = useState({ email: "", password: "" })
    const handleSubmit:FormEventHandler<HTMLFormElement> = (e) => {
        // validate user info
        e.preventDefault()
        const res = signIn('credentals', {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
        })
        console.log(res)
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Form</h1>
                <input
                    value={userInfo.email}
                    onChange={({ target }) => 
                        setUserInfo({ ...userInfo, email: target.value })
                    }
                    type="email"
                    placeholder="example@example.com"
                />
                <input
                    value={userInfo.password}
                    onChange={({ target }) => 
                        setUserInfo({ ...userInfo, password: target.value })
                    }
                    type="password"
                    placeholder="********"
                />
                <input type="submit" value="Login" /> 
            </form>
        </div>
    )
}

export default SignIn;