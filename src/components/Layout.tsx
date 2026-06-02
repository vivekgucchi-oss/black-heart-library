import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from '@/components/ui/sonner'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#121414',
            border: '1px solid #2a2c2c',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}
