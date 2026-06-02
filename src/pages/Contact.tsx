import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Clock,
  MapPin,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const submitMutation = trpc.message.submit.useMutation({
    onSuccess: () => {
      toast.success('Message sent successfully! We will get back to you soon.')
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }
    submitMutation.mutate(formData)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/30 mb-4">
            <MessageSquare className="w-8 h-8 text-[#e63946]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Get in Touch
          </h1>
          <p className="text-[#6b7280] max-w-lg mx-auto">
            Have questions, feedback, or need support? We are here to help you 
            navigate the Knowledge Economy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#121414] rounded-xl p-6 border border-[#1f2123]">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e63946]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#e63946]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email</p>
                    <p className="text-sm text-[#6b7280]">support@blackheart.library</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e63946]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#e63946]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Response Time</p>
                    <p className="text-sm text-[#6b7280]">Within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e63946]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#e63946]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Location</p>
                    <p className="text-sm text-[#6b7280]">Digital Realm, Worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-[#121414] rounded-xl p-6 border border-[#1f2123]">
              <h3 className="text-lg font-semibold text-white mb-4">Common Questions</h3>
              <div className="space-y-3">
                {[
                  { q: "How do I publish my work?", a: "Use the Upload page and follow the step-by-step wizard." },
                  { q: "How does monetization work?", a: "Set your price in ETH. You earn from every purchase." },
                  { q: "What is the Trust Score?", a: "A quality metric based on reviews, citations, and engagement." },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-[#1f2123] last:border-0 pb-3 last:pb-0">
                    <p className="text-sm font-medium text-[#e2e8f0] mb-1">{faq.q}</p>
                    <p className="text-xs text-[#6b7280]">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#121414] rounded-xl p-6 sm:p-8 border border-[#1f2123]">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 mb-4">
                    <Check className="w-8 h-8 text-[#10b981]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-[#6b7280] mb-6">Thank you for reaching out. We will get back to you soon.</p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    className="bg-[#e63946] hover:bg-[#c1121f] text-white"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Your name"
                        className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="your@email.com"
                        className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Subject *</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      placeholder="What is this about?"
                      className="bg-[#1a1c1c] border-[#2a2c2c] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#e2e8f0] mb-2">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      className="bg-[#1a1c1c] border-[#2a2c2c] text-white min-h-[150px] resize-none"
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full bg-[#e63946] hover:bg-[#c1121f] text-white py-6"
                  >
                    {submitMutation.isPending ? 'Sending...' : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
