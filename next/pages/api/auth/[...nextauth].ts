import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                // email: { label: "Email", type: "email", placeholder: "email@email.com" },
                // password: { label: "Password", type: "password", placeholder: "********"}
            },
            authorize(credentials, req) {
                const { email, password } = credentials as {
                    email: string,
                    password: string
                }
                if (email !== "john@email.com" || password !== "1234") {
                    throw new Error("invalid credentials");
                }
                return {id: "1234", name: "John Doe", email: "john@email.com"}
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
        // error: '/auth/error',
        // signOut: '/auth/signout',
    }
}

export default NextAuth(authOptions);