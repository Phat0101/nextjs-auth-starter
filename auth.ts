import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== NextAuth Authorize Function Called ===");
        console.log("Environment:", process.env.NODE_ENV);
        console.log("Database URL exists:", !!process.env.DATABASE_URL);
        console.log("NextAuth Secret exists:", !!process.env.NEXT_AUTH_SECRET);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Invalid credentials");
        }

        try {
          console.log("Attempting to connect to database...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          console.log("Database query successful, user found:", !!user);

          if (!user) {
            console.log("User not found, creating new user...");
            const newUser = await prisma.user.create({
              data: {
                name: credentials.name ?? credentials.email,
                email: credentials.email,
                password: await bcrypt.hash(credentials.password, 10),
              },
            });
            console.log("New user created successfully");
            return newUser;
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password verification result:", isCorrectPassword);

          if (!isCorrectPassword) {
            console.log("Invalid password");
            throw new Error("Invalid credentials");
          }

          console.log("Authentication successful for user:", user.email);
          return user;
        } catch (error) {
          console.error("=== Database/Auth Error ===");
          console.error("Error details:", error);
          console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
          console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
          throw new Error("Authentication failed - check logs");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, id: token.id ?? user?.id };
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.id } };
    },
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthOptions;