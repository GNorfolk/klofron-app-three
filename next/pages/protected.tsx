import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Router from "next/router"
import { useEffect } from "react";

const Protected: NextPage = (): JSX.Element => {
    const { status, data } = useSession()

    useEffect(() => {
        if (status === "unauthenticated") Router.replace("/api/auth/signin")
    }, [status])

    if (status === "authenticated") {
        return (
            <div>
                This page is protected for special people like{"\n"}
                {JSON.stringify(data.user, null, 2)}
            </div>
        )
    }
    return <div>Loading...</div>
}

export default Protected