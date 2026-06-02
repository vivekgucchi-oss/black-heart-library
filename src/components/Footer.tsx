import { Link } from 'react-router'
import { Heart, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { label: 'Discovery', path: '/discovery' },
      { label: 'Upload Research', path: '/upload' },
      { label: 'AI Assistant', path: '/chat' },
      { label: 'My Library', path: '/library' },
    ],
    community: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'About', path: '/' },
      { label: 'Terms of Service', path: '#' },
      { label: 'Privacy Policy', path: '#' },
    ],
  }

  return (
    <footer className="border-t border-[#1f2123] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-[0.15em] uppercase text-white">
                Black Heart Library
              </span>
            </Link>
            <p className="text-sm text-[#e2e8f0]/70 max-w-sm mb-6 leading-relaxed">
              The Repository of Human Thought. Discover Knowledge Objects — Books, 
              Theories, and Frameworks for the digital age. Publish knowledge like 
              creators publish videos.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#6b7280] hover:text-[#e63946] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#6b7280] hover:text-[#e63946] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#6b7280] hover:text-[#e63946] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#e2e8f0]/70 hover:text-[#e63946] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] mb-4">
              Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#e2e8f0]/70 hover:text-[#e63946] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1f2123] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6b7280]">
            &copy; {currentYear} Black Heart Library. All rights reserved.
          </p>
          <p className="text-xs text-[#6b7280] flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#e63946]" /> for the love of knowledge
          </p>
        </div>
      </div>
    </footer>
  )
}
