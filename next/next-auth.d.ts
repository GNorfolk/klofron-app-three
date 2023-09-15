import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      family_id: string;
    } & DefaultSession['user'];
  }
}