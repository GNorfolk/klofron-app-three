import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      family_is: string;
    } & DefaultSession['user'];
  }
}