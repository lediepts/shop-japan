import axios from "axios";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "",
      credentials: {
        username: {
          label: "ID",
          type: "text",
          placeholder: "メールアドレスやユーザID",
        },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const nextAuthUrl = new URL(
            "/api/auth/credentials",
            process.env.NEXTAUTH_URL || ""
          );
          const {
            data: { user },
          } = await axios.post(nextAuthUrl.href, { credentials });
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: "bPBEzi7MzBE9pMbgbKkmg3Iv+183gthIXeHwwkX+Fac=",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as any;
      return session;
    },
  },
};
export default NextAuth(authOptions);
