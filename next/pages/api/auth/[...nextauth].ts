import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios'

const authOptions: NextAuthOptions = {
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.family_id = token.family_id;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.family_id = user.family_id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt"
    },
    secret: "say_lalisa_love_me_lalisa_love_me_hey",
    debug: true,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@email.com" },
                password: { label: "Password", type: "password", placeholder: "********"}
            },
            authorize(credentials, req) {
                return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/login', {
                    email: credentials.email,
                    password: credentials.password
                }).then((value) => {
                    if (value.data.success) {
                        return value.data
                    } else {
                        return null
                    }
                })
            }
        })
    ]
}

export default NextAuth(authOptions);