import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { 
  BookOpen, 
  ArrowRight, 
  Star, 
  Shield, 
  Zap,
  Users,
  FileText,
  Atom,
  Upload,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const FEATURED_BOOKS = [
  { id: 1, title: "The Alchemy of Thought", subtitle: "Ancient Wisdom for Modern Minds", type: "BOOK" as const, authorName: "Dr. Elena Voss", price: "0.05", trustScore: "0.92", coverImage: "/images/book-1.jpg", category: "Philosophy", description: null, status: "published" as const },
  { id: 2, title: "Digital Manuscripts", subtitle: "Future of Knowledge Transfer", type: "PDF" as const, authorName: "Prof. Arjun Mehta", price: "0.03", trustScore: "0.88", coverImage: "/images/book-2.jpg", category: "Technology", description: null, status: "published" as const },
  { id: 3, title: "Sacred Geometry & Cosmos", subtitle: "Universal Patterns Decoded", type: "RESEARCH" as const, authorName: "Dr. Maya Chen", price: "0.00", trustScore: "0.95", coverImage: "/images/book-3.jpg", category: "Science", description: null, status: "published" as const },
  { id: 4, title: "The Knowledge Crystal", subtitle: "Multidimensional Learning", type: "FRAMEWORK" as const, authorName: "Prof. James Wright", price: "0.08", trustScore: "0.90", coverImage: "/images/book-4.jpg", category: "Education", description: null, status: "published" as const },
]

const SCHOLARS = [
  { name: "Dr. Elena Voss", works: 12, followers: 2340, avatar: "/images/avatar-1.jpg", level: "Master Creator" },
  { name: "Prof. James Wright", works: 8, followers: 1890, avatar: "/images/avatar-2.jpg", level: "Verified Creator" },
  { name: "Prof. Arjun Mehta", works: 15, followers: 3100, avatar: "/images/avatar-3.jpg", level: "Legend" },
  { name: "Dr. Amara Okafor", works: 6, followers: 1200, avatar: "/images/avatar-4.jpg", level: "Researcher" },
]

const STATS = [
  { icon: BookOpen, label: "Knowledge Objects", value: "12.4K+" },
  { icon: Users, label: "Active Scholars", value: "8.2K+" },
  { icon: FileText, label: "Research Papers", value: "5.6K+" },
  { icon: Zap, label: "Daily Uploads", value: "200+" },
]

export default function Home() {
  const { user } = useAuth()
  const { data: trendingData, isLoading } = trpc.kobject.trending.useQuery()
  const trending = trendingData && trendingData.length > 0 ? trendingData : FEATURED_BOOKS

  return (
    <div>
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#121414] to-[#0a0a0a]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e63946]/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#fbbf24]/10 rounded-full blur-[128px]" />
        </div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e63946]/10 border border-[#e63946]/30 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-[#e63946]" />
            <span className="text-sm text-[#e63946] font-medium">The YouTube of Knowledge</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 animate-fade-in"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Repository of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] via-[#ff6b6b] to-[#fbbf24]">
              Human Thought
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#e2e8f0]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover Knowledge Objects. Books, Theories, Research Papers, 
            and Frameworks for the digital age. Publish your discoveries to the world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/discovery">
              <Button 
                size="lg"
                className="bg-[#e63946] hover:bg-[#c1121f] text-white px-8 py-6 text-lg font-semibold animate-pulse-glow"
              >
                Explore Feed
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/upload">
              <Button 
                size="lg"
                variant="outline"
                className="border-[#e2e8f0]/30 text-[#e2e8f0] hover:bg-[#e2e8f0]/10 px-8 py-6 text-lg"
              >
                Upload Research
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <stat.icon className="w-6 h-6 text-[#e63946] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-[#6b7280] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRENDING K-OBJECTS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Trending Knowledge
            </h2>
            <p className="text-[#6b7280]">Most popular discoveries this week</p>
          </div>
          <Link to="/discovery" className="hidden sm:flex items-center gap-2 text-[#e63946] hover:text-[#ff6b6b] transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-[#121414]">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              </div>
            ))
          ) : (
            trending.slice(0, 4).map((book, i) => (
              <Link 
                to={`/kobject/${book.id}`} 
                key={book.id}
                className="group rounded-xl overflow-hidden bg-[#121414] border border-[#1f2123] hover:border-[#e63946]/50 transition-all duration-300 hover:-translate-y-1 glow-border"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={book.coverImage || '/images/book-1.jpg'} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#e63946] text-white rounded">
                      {book.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                      <span className="text-xs text-[#fbbf24] font-medium">
                        {Number(book.trustScore || 0.5).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg leading-tight mb-1 group-hover:text-[#e63946] transition-colors truncate"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {book.title}
                  </h3>
                  <p className="text-[#6b7280] text-sm mb-3">{book.authorName || 'Anonymous'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#e2e8f0]">{book.category}</span>
                    <span className="text-[#fbbf24] font-bold text-sm">
                      {Number(book.price || 0) > 0 ? `${book.price} ETH` : 'Free'}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link to="/discovery" className="inline-flex items-center gap-2 text-[#e63946]">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── FEATURED SCHOLARS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121414]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Scholars
            </h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              Meet the brilliant minds sharing their knowledge with the world
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SCHOLARS.map((scholar, i) => (
              <div 
                key={i}
                className="group bg-[#1a1c1c] rounded-xl p-6 border border-[#2a2c2c] hover:border-[#e63946]/30 transition-all duration-300 text-center"
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <img 
                    src={scholar.avatar} 
                    alt={scholar.name}
                    className="w-full h-full rounded-full object-cover border-2 border-[#2a2c2c] group-hover:border-[#e63946] transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#e63946] rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-1">{scholar.name}</h3>
                <span className="inline-block px-2 py-1 text-[10px] uppercase tracking-wider bg-[#e63946]/10 text-[#e63946] rounded mb-3">
                  {scholar.level}
                </span>
                <div className="flex items-center justify-center gap-4 text-sm text-[#6b7280]">
                  <span>{scholar.works} works</span>
                  <span>{scholar.followers.toLocaleString()} followers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It Works
          </h2>
          <p className="text-[#6b7280] max-w-xl mx-auto">
            Four simple steps to publish, discover, and monetize knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", icon: Upload, title: "Upload", desc: "Share your Books, PDFs, Research, and Frameworks with rich metadata" },
            { step: "02", icon: Shield, title: "Verify", desc: "AI moderation ensures quality. Trust Score builds your reputation" },
            { step: "03", icon: TrendingUp, title: "Discover", desc: "Readers find your work through our Insight Graph and search engine" },
            { step: "04", icon: Zap, title: "Monetize", desc: "Set your price in ETH. Earn from every purchase and subscription" },
          ].map((item, i) => (
            <div key={i} className="relative text-center group">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl font-black text-[#1f2123] select-none">
                {item.step}
              </span>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center group-hover:bg-[#e63946]/20 transition-colors">
                  <item.icon className="w-7 h-7 text-[#e63946]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#e63946]/10 via-[#121414] to-[#fbbf24]/10 rounded-2xl p-12 border border-[#2a2c2c]">
          <Atom className="w-12 h-12 text-[#e63946] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Share Your Knowledge?
          </h2>
          <p className="text-[#e2e8f0]/70 mb-8 max-w-lg mx-auto">
            Join thousands of scholars who are transforming how humanity 
            discovers and shares intellectual capital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? "/upload" : "/login"}>
              <Button 
                size="lg"
                className="bg-[#e63946] hover:bg-[#c1121f] text-white px-8 py-6 text-lg font-semibold"
              >
                Start Creating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/discovery">
              <Button 
                size="lg"
                variant="outline"
                className="border-[#e2e8f0]/30 text-[#e2e8f0] hover:bg-[#e2e8f0]/10 px-8 py-6 text-lg"
              >
                Explore Feed
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
