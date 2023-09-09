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
                email: { label: "Email", type: "email", placeholder: "email@email.com" },
                password: { label: "Password", type: "password", placeholder: "********"}
            },
            authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = { id: "1", name: "Some Body", email: credentials.email }
                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null
                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })
    ],
    pages: {
        // signIn: '/auth/signin',
        // error: '/auth/error',
        // signOut: '/auth/signout',
    }
}

export default NextAuth(authOptions);