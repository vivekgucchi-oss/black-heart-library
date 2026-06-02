import { useState, useRef, useEffect } from 'react'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import { 
  Send, 
  Atom, 
  User, 
  Sparkles,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function AIChat() {
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{role: string, message: string}>>([])
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatMutation = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setChatMessages(prev => [...prev, { role: 'assistant', message: data.response }])
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = () => {
    if (!message.trim()) return
    const userMsg = message.trim()
    setChatMessages(prev => [...prev, { role: 'user', message: userMsg }])
    setMessage('')
    chatMutation.mutate({ message: userMsg, sessionId })
  }

  const clearChat = () => {
    setChatMessages([])
  }

  const quickPrompts = [
    "Explain the philosophy of knowledge",
    "What are the latest research trends?",
    "Recommend books on cognitive science",
    "How does the trust score work?",
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#1f2123] bg-[#121414]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Knowledge Assistant</h1>
              <p className="text-xs text-[#6b7280] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#fbbf24]" />
                Powered by Insight Engine
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-[#6b7280] hover:text-[#e63946]"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea className="flex-1 px-4 py-6">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center mb-6">
                <Atom className="w-10 h-10 text-[#e63946]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Welcome to the Insight Engine
              </h2>
              <p className="text-[#6b7280] max-w-md mb-8">
                Your AI companion for exploring knowledge. Ask me anything about 
                the knowledge objects, research topics, or scholarly concepts.
              </p>
              
              {/* Quick Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMessage(prompt)
                    }}
                    className="p-3 rounded-xl bg-[#121414] border border-[#2a2c2c] text-left text-sm text-[#e2e8f0] hover:border-[#e63946]/30 hover:bg-[#1a1c1c] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center shrink-0">
                      <Atom className="w-4 h-4 text-[#e63946]" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#e63946] text-white rounded-br-md'
                        : 'bg-[#121414] border border-[#2a2c2c] text-[#e2e8f0] rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-[#1a1c1c] border border-[#2a2c2c] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#e2e8f0]" />
                    </div>
                  )}
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center shrink-0">
                    <Atom className="w-4 h-4 text-[#e63946] animate-spin" />
                  </div>
                  <div className="bg-[#121414] border border-[#2a2c2c] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#6b7280] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-[#1f2123] bg-[#121414] p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about knowledge..."
              className="flex-1 bg-[#1a1c1c] border-[#2a2c2c] text-white placeholder:text-[#6b7280] focus:border-[#e63946]"
            />
            <Button 
              onClick={handleSend}
              disabled={chatMutation.isPending || !message.trim()}
              className="bg-[#e63946] hover:bg-[#c1121f] text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-center text-xs text-[#6b7280] mt-3">
            AI responses are generated for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  )
}
