import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { 
  Star, 
  ArrowLeft, 
  Download, 
  Share2, 
  BookOpen,
  FileText,
  Atom,
  Lightbulb,
  Layers,
  Scroll,
  MessageSquare,
  ShoppingCart,
  Send,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

const TYPE_ICONS: Record<string, any> = {
  BOOK: BookOpen, PDF: FileText, PAPER: Scroll,
  RESEARCH: Atom, THEORY: Lightbulb, FRAMEWORK: Layers, NOTE: FileText,
}

const TYPE_LABELS: Record<string, string> = {
  BOOK: "Book", PDF: "PDF Document", PAPER: "Research Paper",
  RESEARCH: "Research", THEORY: "Theory", FRAMEWORK: "Framework", NOTE: "Note",
}

export default function KObjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const kObjectId = Number(id)

  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [showAiChat, setShowAiChat] = useState(false)

  const { data: kobject, isLoading } = trpc.kobject.getById.useQuery({ id: kObjectId })
  const { data: hasPurchased, refetch: refetchPurchase } = trpc.kobject.checkPurchase.useQuery(
    { kObjectId },
    { enabled: !!user }
  )
  const { data: reviews } = trpc.review.list.useQuery({ kObjectId })
  const { data: avgRating } = trpc.review.averageRating.useQuery({ kObjectId })

  const purchaseMutation = trpc.kobject.purchase.useMutation({
    onSuccess: (data) => {
      if (data.alreadyPurchased) {
        toast.info('You already own this Knowledge Object')
      } else {
        toast.success('Purchase successful! Added to your library.')
      }
      refetchPurchase()
    },
    onError: (err) => toast.error(err.message),
  })

  const reviewMutation = trpc.review.create.useMutation({
    onSuccess: () => {
      toast.success('Review submitted!')
      setReviewComment('')
    },
    onError: (err) => toast.error(err.message),
  })

  const chatMutation = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setAiResponse(data.response)
      setAiQuestion('')
    },
    onError: (err) => toast.error(err.message),
  })

  const handlePurchase = () => {
    if (!user) {
      toast.error('Please sign in to purchase')
      navigate('/login')
      return
    }
    purchaseMutation.mutate({ kObjectId })
  }

  const handleReviewSubmit = () => {
    if (!user) {
      toast.error('Please sign in to leave a review')
      return
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a comment')
      return
    }
    reviewMutation.mutate({ kObjectId, rating: reviewRating, comment: reviewComment })
  }

  const handleAiAsk = () => {
    if (!aiQuestion.trim()) return
    const sessionId = `kobj-${kObjectId}-${user?.id || 'guest'}`
    chatMutation.mutate({ message: aiQuestion, sessionId, kObjectId })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="w-full aspect-[3/4] rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-1/2 h-5" />
              <Skeleton className="w-full h-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!kobject) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#2a2c2c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Knowledge Object Not Found</h2>
          <p className="text-[#6b7280] mb-4">The item you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/discovery')} variant="outline">
            Back to Discovery
          </Button>
        </div>
      </div>
    )
  }

  const TypeIcon = TYPE_ICONS[kobject.type] || BookOpen
  const isFree = Number(kobject.price) === 0
  const canAccess = isFree || hasPurchased

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6b7280] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cover Image */}
          <div className="lg:col-span-1">
            <div className="rounded-xl overflow-hidden border border-[#2a2c2c] bg-[#121414]">
              <img 
                src={kobject.coverImage || `/images/book-${(kobject.id % 4) + 1}.jpg`}
                alt={kobject.title}
                className="w-full aspect-[3/4] object-cover"
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-3">
              {canAccess ? (
                <Button 
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              ) : (
                <Button 
                  onClick={handlePurchase}
                  disabled={purchaseMutation.isPending}
                  className="w-full bg-[#e63946] hover:bg-[#c1121f] text-white"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {purchaseMutation.isPending ? 'Processing...' : `Purchase for ${kobject.price} ETH`}
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-[#2a2c2c] text-[#e2e8f0]">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#2a2c2c] text-[#e2e8f0]"
                  onClick={() => setShowAiChat(!showAiChat)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  AI Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#e63946]/10 text-[#e63946] rounded-full border border-[#e63946]/30">
                  <TypeIcon className="w-3 h-3" />
                  {TYPE_LABELS[kobject.type] || kobject.type}
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-[#1a1c1c] text-[#e2e8f0] rounded-full border border-[#2a2c2c]">
                  {kobject.category}
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-[#1a1c1c] text-[#e2e8f0] rounded-full border border-[#2a2c2c]">
                  {kobject.language}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {kobject.title}
              </h1>
              {kobject.subtitle && (
                <p className="text-lg text-[#e2e8f0]/70 mb-3">{kobject.subtitle}</p>
              )}
              <p className="text-[#6b7280]">
                by <span className="text-[#e2e8f0]">{kobject.authorName || 'Anonymous'}</span>
                {kobject.publicationYear && ` · ${kobject.publicationYear}`}
              </p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Trust', value: Number(kobject.trustScore || 0).toFixed(2), color: 'text-[#fbbf24]' },
                { label: 'Originality', value: Number(kobject.originalityScore || 0).toFixed(2), color: 'text-[#10b981]' },
                { label: 'Engagement', value: Number(kobject.engagementScore || 0).toFixed(2), color: 'text-[#3b82f6]' },
                { label: 'Popularity', value: Number(kobject.popularityScore || 0).toFixed(2), color: 'text-[#e63946]' },
              ].map((score) => (
                <div key={score.label} className="bg-[#121414] rounded-xl p-4 border border-[#1f2123]">
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">{score.label}</p>
                  <p className={`text-2xl font-bold ${score.color}`}>{score.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {kobject.description && (
              <div className="bg-[#121414] rounded-xl p-6 border border-[#1f2123]">
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-[#e2e8f0]/80 leading-relaxed">{kobject.description}</p>
              </div>
            )}

            {/* AI Summary */}
            {kobject.aiSummary && (
              <div className="bg-gradient-to-r from-[#e63946]/5 to-[#fbbf24]/5 rounded-xl p-6 border border-[#e63946]/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Atom className="w-5 h-5 text-[#e63946]" />
                  AI Summary
                </h3>
                <p className="text-[#e2e8f0]/80 leading-relaxed">{kobject.aiSummary}</p>
              </div>
            )}

            {/* Tags */}
            {kobject.tags && (
              <div className="flex flex-wrap gap-2">
                {kobject.tags.split(',').map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs bg-[#1a1c1c] text-[#e2e8f0] rounded-full border border-[#2a2c2c]">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* AI Chat Panel */}
            {showAiChat && (
              <div className="bg-[#121414] rounded-xl p-6 border border-[#2a2c2c]">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#e63946]" />
                  AI Knowledge Assistant
                </h3>
                
                {aiResponse && (
                  <div className="mb-4 p-4 bg-[#1a1c1c] rounded-lg border border-[#2a2c2c]">
                    <div className="flex items-start gap-2">
                      <Atom className="w-5 h-5 text-[#e63946] shrink-0 mt-0.5" />
                      <p className="text-[#e2e8f0] text-sm leading-relaxed">{aiResponse}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                    placeholder="Ask anything about this knowledge object..."
                    className="flex-1 bg-[#1a1c1c] border-[#2a2c2c] text-white"
                  />
                  <Button 
                    onClick={handleAiAsk}
                    disabled={chatMutation.isPending || !aiQuestion.trim()}
                    className="bg-[#e63946] hover:bg-[#c1121f] text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-[#121414] rounded-xl p-6 border border-[#1f2123]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#fbbf24]" />
                  Reviews
                  {avgRating && (
                    <span className="text-sm text-[#6b7280] font-normal">
                      ({avgRating.average}/5 from {reviews?.length || 0} reviews)
                    </span>
                  )}
                </h3>
              </div>

              {/* Review Form */}
              {user && (
                <div className="mb-6 p-4 bg-[#1a1c1c] rounded-lg border border-[#2a2c2c]">
                  <h4 className="text-sm font-medium text-white mb-3">Write a Review</h4>
                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="transition-colors"
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= reviewRating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-[#2a2c2c]'}`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-[#e2e8f0] ml-2">{reviewRating}/5</span>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="flex-1 bg-[#121414] border-[#2a2c2c] text-white resize-none"
                      rows={2}
                    />
                    <Button 
                      onClick={handleReviewSubmit}
                      disabled={reviewMutation.isPending}
                      className="bg-[#e63946] hover:bg-[#c1121f] text-white self-end"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-[#1a1c1c] rounded-lg border border-[#2a2c2c]">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-[#6b7280]" />
                        <span className="text-sm font-medium text-white">Scholar #{review.userId}</span>
                        <div className="flex items-center gap-0.5 ml-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-[#2a2c2c]'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-[#e2e8f0]/80">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#6b7280] py-4">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
