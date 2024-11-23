
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { OrderProvider } from "@/context/OrderContext"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Purchase Orders Dashboard',
  description: 'Enterprise Purchase Order Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OrderProvider>
          {children}
        </OrderProvider>
      </body>
    </html>
  )
}