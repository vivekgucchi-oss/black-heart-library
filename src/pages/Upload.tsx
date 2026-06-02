import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import { 
  UploadCloud, 
  BookOpen, 
  FileText, 
  Atom, 
  Lightbulb,
  Layers,
  Scroll,
  ArrowRight,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'


const TYPES = [
  { value: "BOOK", label: "Book", icon: BookOpen },
  { value: "PDF", label: "PDF Document", icon: FileText },
  { value: "PAPER", label: "Research Paper", icon: Scroll },
  { value: "RESEARCH", label: "Research", icon: Atom },
  { value: "THEORY", label: "Theory", icon: Lightbulb },
  { value: "FRAMEWORK", label: "Framework", icon: Layers },
  { value: "NOTE", label: "Note", icon: FileText },
]

const CATEGORIES = [
  "Philosophy", "Technology", "Science", "Education", 
  "Mathematics", "Psychology", "History", "Art", "Business"
]

const STEPS = [
  { number: "01", label: "Basic Info" },
  { number: "02", label: "Details" },
  { number: "03", label: "Pricing" },
  { number: "04", label: "Publish" },
]

export default function Upload() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    type: '' as string,
    category: '',
    tags: '',
    language: 'English',
    authorName: '',
    publicationYear: new Date().getFullYear(),
    price: '0',
    isFree: 1,
    coverImage: '',
  })

  const createMutation = trpc.kobject.create.useMutation({
    onSuccess: (data) => {
      toast.success('Knowledge Object published successfully!')
      navigate(`/kobject/${data.id}`)
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = () => {
    if (!user) {
      toast.error('Please sign in to publish')
      navigate('/login')
      return
    }

    if (!formData.title || !formData.type || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    createMutation.mutate({
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      description: formData.description || undefined,
      type: formData.type as any,
      category: formData.category,
      tags: formData.tags || undefined,
      language: formData.language,
      authorName: formData.authorName || undefined,
      publicationYear: formData.publicationYear || undefined,
      price: formData.isFree ? '0' : formData.price,
      isFree: formData.isFree,
    })
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/30 mb-4">
            <UploadCloud className="w-8 h-8 text-[#e63946]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Publish Knowledge
          </h1>
          <p className="text-[#6b7280]">Share your books, research, theories, and frameworks with the world</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10 px-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex flex-col items-center ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < step ? 'bg-[#10b981] text-white' :
                  i === step ? 'bg-[#e63946] text-white' :
                  'bg-[#1a1c1c] text-[#6b7280] border border-[#2a2c2c]'
                }`}>
                  {i < step ? <Check className="w-5 h-5" /> : s.number}
                </div>
                <span className="text-xs text-[#6b7280] mt-2 hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 ${i < step ? 'bg-[#10b981]' : 'bg-[#2a2c2c]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-[#121414] rounded-2xl p-6 sm:p-8 border border-[#1f2123]">
          {/* Step 1: Basic Info */}
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter the title of your Knowledge Object"
                  className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Subtitle</label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="A brief tagline or subtitle"
                  className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => updateField('type', t.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-colors text-left ${
                        formData.type === t.value
                          ? 'border-[#e63946] bg-[#e63946]/10 text-white'
                          : 'border-[#2a2c2c] bg-[#1a1c1c] text-[#e2e8f0] hover:border-[#e63946]/30'
                      }`}
                    >
                      <t.icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your Knowledge Object in detail..."
                  className="bg-[#1a1c1c] border-[#2a2c2c] text-white min-h-[120px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Category *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateField('category', cat)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        formData.category === cat
                          ? 'bg-[#e63946] text-white'
                          : 'bg-[#1a1c1c] text-[#e2e8f0] border border-[#2a2c2c] hover:border-[#e63946]/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Tags (comma-separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => updateField('tags', e.target.value)}
                  placeholder="philosophy, cognition, learning"
                  className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Author Name</label>
                  <Input
                    value={formData.authorName}
                    onChange={(e) => updateField('authorName', e.target.value)}
                    placeholder="Your name or pen name"
                    className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Publication Year</label>
                  <Input
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => updateField('publicationYear', parseInt(e.target.value))}
                    className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Pricing Model</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => { updateField('isFree', 1); updateField('price', '0') }}
                    className={`p-6 rounded-xl border transition-colors text-center ${
                      formData.isFree === 1
                        ? 'border-[#e63946] bg-[#e63946]/10'
                        : 'border-[#2a2c2c] bg-[#1a1c1c] hover:border-[#e63946]/30'
                    }`}
                  >
                    <p className="text-lg font-bold text-white mb-1">Free</p>
                    <p className="text-sm text-[#6b7280]">Share knowledge freely with the community</p>
                  </button>
                  <button
                    onClick={() => updateField('isFree', 0)}
                    className={`p-6 rounded-xl border transition-colors text-center ${
                      formData.isFree === 0
                        ? 'border-[#e63946] bg-[#e63946]/10'
                        : 'border-[#2a2c2c] bg-[#1a1c1c] hover:border-[#e63946]/30'
                    }`}
                  >
                    <p className="text-lg font-bold text-white mb-1">Paid</p>
                    <p className="text-sm text-[#6b7280]">Monetize your intellectual capital</p>
                  </button>
                </div>
              </div>

              {formData.isFree === 0 && (
                <div>
                  <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Price (ETH)</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      placeholder="0.05"
                      className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                    />
                    <span className="text-[#6b7280] shrink-0">ETH</span>
                  </div>
                  <p className="text-xs text-[#6b7280] mt-2">
                    Suggested: 0.01 - 0.10 ETH for most content
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Cover Image URL</label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) => updateField('coverImage', e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                />
              </div>
            </div>
          )}

          {/* Step 4: Publish */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 mb-4">
                  <Check className="w-8 h-8 text-[#10b981]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to Publish</h3>
                <p className="text-[#6b7280] mb-6">Review your Knowledge Object before publishing</p>
              </div>

              <div className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2a2c2c] space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Title</span>
                  <span className="text-white font-medium text-right">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Type</span>
                  <span className="text-white">{formData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Category</span>
                  <span className="text-white">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Price</span>
                  <span className="text-[#fbbf24] font-bold">
                    {formData.isFree ? 'Free' : `${formData.price} ETH`}
                  </span>
                </div>
                {formData.authorName && (
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Author</span>
                    <span className="text-white">{formData.authorName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#1f2123]">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="border-[#2a2c2c] text-[#e2e8f0] hover:bg-[#1a1c1c]"
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-[#e63946] hover:bg-[#c1121f] text-white"
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="bg-[#10b981] hover:bg-[#059669] text-white"
              >
                {createMutation.isPending ? 'Publishing...' : 'Publish Knowledge Object'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
