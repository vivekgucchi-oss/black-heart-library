import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import KObjectDetail from './pages/KObjectDetail'
import Upload from './pages/Upload'
import AIChat from './pages/AIChat'
import AdminDashboard from './pages/AdminDashboard'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import MyLibrary from './pages/MyLibrary'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/kobject/:id" element={<KObjectDetail />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/library" element={<MyLibrary />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
