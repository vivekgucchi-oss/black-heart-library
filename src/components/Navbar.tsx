import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { 
  Search, 
  BookOpen, 
  Compass, 
  Upload, 
  MessageSquare, 
  User, 
  Library, 
  LogOut,
  Menu,
  X,
  Shield,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

export default function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const isAdmin = user?.role === 'admin'

  const navLinks = [
    { path: '/', label: 'Home', icon: BookOpen },
    { path: '/discovery', label: 'Discovery', icon: Compass },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/chat', label: 'AI Chat', icon: MessageSquare },
    { path: '/contact', label: 'Contact', icon: MessageSquare },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1f2123]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-white hidden sm:block">
              Black Heart
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <Input
                type="text"
                placeholder="Search knowledge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-[#1a1c1c] border-[#2a2c2c] text-white placeholder:text-[#6b7280] focus:border-[#e63946] focus:ring-[#e63946]/20"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#e63946] bg-[#e63946]/10'
                    : 'text-[#e2e8f0] hover:text-white hover:bg-[#1a1c1c]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#1a1c1c] animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-[#1a1c1c] transition-colors">
                    <img
                      src={user.avatar || '/images/avatar-1.jpg'}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-[#2a2c2c]"
                    />
                    <span className="text-sm text-[#e2e8f0] hidden sm:block max-w-[100px] truncate">
                      {user.name || 'Scholar'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#121414] border-[#2a2c2c]">
                  <div className="px-3 py-2 border-b border-[#2a2c2c]">
                    <p className="text-sm font-medium text-white">{user.name || 'Scholar'}</p>
                    <p className="text-xs text-[#6b7280]">{user.email || ''}</p>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#1a1c1c]">
                    <Link to="/profile" className="flex items-center gap-2 text-[#e2e8f0]">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#1a1c1c]">
                    <Link to="/library" className="flex items-center gap-2 text-[#e2e8f0]">
                      <Library className="w-4 h-4" />
                      My Library
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#1a1c1c]">
                      <Link to="/admin" className="flex items-center gap-2 text-[#e63946]">
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#2a2c2c]" />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer hover:bg-[#1a1c1c] text-[#e63946]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  size="sm" 
                  className="bg-[#e63946] hover:bg-[#c1121f] text-white"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-[#1a1c1c] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#1f2123] animate-fade-in">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <Input
                  type="text"
                  placeholder="Search knowledge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-[#1a1c1c] border-[#2a2c2c] text-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#e63946] bg-[#e63946]/10'
                      : 'text-[#e2e8f0] hover:text-white hover:bg-[#1a1c1c]'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-[#e63946] hover:bg-[#1a1c1c]"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
