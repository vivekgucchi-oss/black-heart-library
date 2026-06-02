import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import { 
  Library, 
  BookOpen, 
  ArrowRight,
  Download,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function MyLibrary() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const { data: library, isLoading } = trpc.kobject.myLibrary.useQuery(undefined, {
    enabled: !!user,
  })

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="w-full h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <Library className="w-16 h-16 text-[#2a2c2c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-[#6b7280] mb-4">Sign in to access your personal library</p>
          <Button onClick={() => navigate('/login')} className="bg-[#e63946] hover:bg-[#c1121f] text-white">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              My Library
            </h1>
            <p className="text-[#6b7280]">
              {library?.length || 0} Knowledge Objects in your collection
            </p>
          </div>
          <Link to="/discovery">
            <Button className="bg-[#e63946] hover:bg-[#c1121f] text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Discover More
            </Button>
          </Link>
        </div>

        {/* Library Grid */}
        {library && library.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {library.map((book) => (
              <div 
                key={book.id}
                className="group bg-[#121414] rounded-xl overflow-hidden border border-[#1f2123] hover:border-[#e63946]/50 transition-all duration-300"
              >
                <Link to={`/kobject/${book.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={book.coverImage || `/images/book-${(book.id % 4) + 1}.jpg`}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#10b981] text-white rounded">
                        Owned
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/kobject/${book.id}`}>
                    <h3 className="text-white font-semibold text-lg leading-tight mb-1 group-hover:text-[#e63946] transition-colors truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-[#6b7280] text-sm mb-3">{book.authorName || 'Anonymous'}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                      <span className="text-xs text-[#fbbf24]">{Number(book.trustScore || 0).toFixed(2)}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/10">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121414] rounded-2xl border border-[#1f2123]">
            <Library className="w-16 h-16 text-[#2a2c2c] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your Library is Empty</h3>
            <p className="text-[#6b7280] mb-6 max-w-md mx-auto">
              Start building your personal knowledge collection by discovering 
              and purchasing Knowledge Objects.
            </p>
            <Link to="/discovery">
              <Button className="bg-[#e63946] hover:bg-[#c1121f] text-white">
                Explore Discovery
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
