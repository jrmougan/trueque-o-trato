import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Trueque o Trato - Intercambia sin dinero",
  description:
    "Plataforma de trueque donde el dinero esta prohibido. Intercambia objetos que ya no usas por cosas que necesitas.",
  keywords: [
    "trueque",
    "intercambio",
    "sin dinero",
    "sostenibilidad",
    "economia circular",
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar user={session?.user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
