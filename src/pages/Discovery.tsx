import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { 
  Search, 
  Star, 
  BookOpen, 
  FileText, 
  Atom, 
  Lightbulb,
  Layers,
  Scroll,
  Grid3X3,
  List
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TYPE_ICONS: Record<string, any> = {
  BOOK: BookOpen,
  PDF: FileText,
  PAPER: Scroll,
  RESEARCH: Atom,
  THEORY: Lightbulb,
  FRAMEWORK: Layers,
  NOTE: FileText,
}

const CATEGORIES = [
  "All", "Philosophy", "Technology", "Science", "Education", 
  "Mathematics", "Psychology", "History", "Art", "Business"
]

export default function Discovery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trust' | 'price_asc' | 'price_desc'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data, isLoading } = trpc.kobject.list.useQuery({
    search: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    type: selectedType || undefined,
    sortBy,
    limit: 24,
    offset: 0,
  })

  trpc.kobject.categories.useQuery()

  const kObjects = data?.items || []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#1f2123] bg-[#121414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Knowledge Discovery
          </h1>
          <p className="text-[#6b7280]">Explore and search through our repository of human thought</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
            <Input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-[#1a1c1c] border-[#2a2c2c] text-white placeholder:text-[#6b7280] focus:border-[#e63946]"
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full lg:w-40 bg-[#1a1c1c] border-[#2a2c2c] text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1c1c] border-[#2a2c2c]">
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="BOOK">Book</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="PAPER">Paper</SelectItem>
              <SelectItem value="RESEARCH">Research</SelectItem>
              <SelectItem value="THEORY">Theory</SelectItem>
              <SelectItem value="FRAMEWORK">Framework</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-full lg:w-44 bg-[#1a1c1c] border-[#2a2c2c] text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1c1c] border-[#2a2c2c]">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trust">Highest Trust</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex gap-1 bg-[#1a1c1c] rounded-lg p-1 border border-[#2a2c2c]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#e63946] text-white' : 'text-[#6b7280] hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#e63946] text-white' : 'text-[#6b7280] hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#e63946] text-white'
                  : 'bg-[#1a1c1c] text-[#e2e8f0] hover:bg-[#2a2c2c] border border-[#2a2c2c]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-[#121414] border border-[#1f2123]">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : kObjects.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[#2a2c2c] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Knowledge Objects Found</h3>
            <p className="text-[#6b7280]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
            {kObjects.map((book) => {
              const TypeIcon = TYPE_ICONS[book.type] || BookOpen
              return viewMode === 'grid' ? (
                <Link 
                  to={`/kobject/${book.id}`} 
                  key={book.id}
                  className="group rounded-xl overflow-hidden bg-[#121414] border border-[#1f2123] hover:border-[#e63946]/50 transition-all duration-300 hover:-translate-y-1 glow-border"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={book.coverImage || `/images/book-${(book.id % 4) + 1}.jpg`}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#e63946] text-white rounded flex items-center gap-1">
                        <TypeIcon className="w-3 h-3" />
                        {book.type}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1">
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
                      <span className="text-xs text-[#e2e8f0] bg-[#1a1c1c] px-2 py-1 rounded">{book.category}</span>
                      <span className="text-[#fbbf24] font-bold text-sm">
                        {Number(book.price) > 0 ? `${book.price} ETH` : 'Free'}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link 
                  to={`/kobject/${book.id}`} 
                  key={book.id}
                  className="group flex gap-4 bg-[#121414] border border-[#1f2123] hover:border-[#e63946]/50 rounded-xl p-4 transition-all duration-300"
                >
                  <img 
                    src={book.coverImage || `/images/book-${(book.id % 4) + 1}.jpg`}
                    alt={book.title}
                    className="w-24 h-32 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#e63946] font-bold">{book.type}</span>
                        <h3 className="text-white font-semibold text-lg group-hover:text-[#e63946] transition-colors truncate"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {book.title}
                        </h3>
                      </div>
                      <span className="text-[#fbbf24] font-bold shrink-0">
                        {Number(book.price) > 0 ? `${book.price} ETH` : 'Free'}
                      </span>
                    </div>
                    <p className="text-[#6b7280] text-sm mb-2">{book.authorName || 'Anonymous'}</p>
                    <p className="text-[#e2e8f0]/70 text-sm line-clamp-2 mb-2">{book.description || 'No description available.'}</p>
                    <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                        {Number(book.trustScore || 0.5).toFixed(2)}
                      </span>
                      <span>{book.category}</span>
                      <span>{book.language}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && kObjects.length > 0 && (
          <p className="text-center text-sm text-[#6b7280] mt-8">
            Showing {kObjects.length} of {data?.total || 0} Knowledge Objects
          </p>
        )}
      </div>
    </div>
  )
}
