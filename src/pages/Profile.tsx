import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/providers/trpc'
import { 
  User, 
  BookOpen, 
  ShoppingCart, 
  Shield,
  Award,
  Zap,
  Star,
  ArrowRight,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const LEVEL_COLORS: Record<string, string> = {
  'Explorer': 'text-[#6b7280]',
  'Contributor': 'text-[#3b82f6]',
  'Researcher': 'text-[#10b981]',
  'Verified Creator': 'text-[#fbbf24]',
  'Master Creator': 'text-[#e63946]',
  'Legend': 'text-[#a855f7]',
}

const BADGES = [
  { id: 'first_upload', name: 'First Upload', icon: BookOpen, color: '#10b981' },
  { id: 'trending', name: 'Trending', icon: Zap, color: '#fbbf24' },
  { id: 'verified', name: 'Verified', icon: Shield, color: '#3b82f6' },
  { id: 'master', name: 'Master', icon: Award, color: '#e63946' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading, logout } = useAuth()
  const { data: profile, isLoading } = trpc.user.myProfile.useQuery(undefined, {
    enabled: !!user,
  })
  const { data: myCreations } = trpc.kobject.myCreations.useQuery(undefined, {
    enabled: !!user,
  })

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="w-full h-48 rounded-xl" />
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <User className="w-16 h-16 text-[#2a2c2c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-[#6b7280] mb-4">Please sign in to view your profile</p>
          <Button onClick={() => navigate('/login')} className="bg-[#e63946] hover:bg-[#c1121f] text-white">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const xp = profile?.xp
  const creatorStats = profile?.creatorStats
  const levelName = creatorStats?.creatorLevel || 'Explorer'
  const xpProgress = xp ? Math.min(100, (xp.xp / (xp.level * 100)) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-[#121414] rounded-2xl p-6 sm:p-8 border border-[#1f2123] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#e63946]/5 rounded-full blur-[80px]" />
          
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img 
              src={user.avatar || '/images/avatar-1.jpg'} 
              alt={user.name || 'User'}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#2a2c2c]"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {user.name || 'Scholar'}
                </h1>
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                  user.role === 'admin' 
                    ? 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]/30' 
                    : 'bg-[#1a1c1c] text-[#e2e8f0] border-[#2a2c2c]'
                }`}>
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
              </div>
              <p className="text-[#6b7280] mb-1">{user.email || ''}</p>
              <p className={`text-sm font-medium ${LEVEL_COLORS[levelName] || 'text-[#6b7280]'}`}>
                {levelName}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-[#2a2c2c] text-[#e2e8f0] hover:bg-[#e63946]/10 hover:text-[#e63946] hover:border-[#e63946]/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Creations', value: profile?.kObjectCount || 0, icon: BookOpen, color: 'text-[#10b981]' },
            { label: 'Purchases', value: profile?.purchaseCount || 0, icon: ShoppingCart, color: 'text-[#fbbf24]' },
            { label: 'Followers', value: creatorStats?.totalFollowers || 0, icon: User, color: 'text-[#3b82f6]' },
            { label: 'Revenue', value: `${Number(creatorStats?.revenue || 0).toFixed(4)} ETH`, icon: Zap, color: 'text-[#a855f7]' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#121414] rounded-xl p-4 border border-[#1f2123]">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#6b7280]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        {xp && (
          <div className="bg-[#121414] rounded-xl p-6 border border-[#1f2123]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#fbbf24]" />
                <h3 className="text-lg font-semibold text-white">Level {xp.level}</h3>
              </div>
              <span className="text-sm text-[#6b7280]">{xp.xp} XP</span>
            </div>
            <div className="w-full h-3 bg-[#1a1c1c] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#e63946] to-[#fbbf24] rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#6b7280] mt-2">
              {xp.readingXp} Reading XP · {xp.creatorXp} Creator XP
            </p>
          </div>
        )}

        {/* My Creations */}
        <div className="bg-[#121414] rounded-xl border border-[#1f2123]">
          <div className="p-4 border-b border-[#1f2123] flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">My Creations</h3>
            <Link to="/upload" className="text-sm text-[#e63946] hover:text-[#ff6b6b] flex items-center gap-1">
              Upload New <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {myCreations && myCreations.length > 0 ? (
            <div className="divide-y divide-[#1f2123]">
              {myCreations.slice(0, 5).map((ko) => (
                <Link 
                  to={`/kobject/${ko.id}`} 
                  key={ko.id}
                  className="flex items-center gap-4 p-4 hover:bg-[#1a1c1c] transition-colors"
                >
                  <img 
                    src={ko.coverImage || `/images/book-${(ko.id % 4) + 1}.jpg`}
                    alt={ko.title}
                    className="w-12 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{ko.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                      <span>{ko.type}</span>
                      <span>·</span>
                      <span>{ko.category}</span>
                      <span>·</span>
                      <span className={ko.status === 'published' ? 'text-[#10b981]' : 'text-[#fbbf24]'}>
                        {ko.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#fbbf24] text-sm font-medium shrink-0">
                    {Number(ko.price) > 0 ? `${ko.price} ETH` : 'Free'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[#2a2c2c] mx-auto mb-3" />
              <p className="text-[#6b7280] mb-4">No creations yet. Start publishing!</p>
              <Link to="/upload">
                <Button className="bg-[#e63946] hover:bg-[#c1121f] text-white">
                  Upload Knowledge
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="bg-[#121414] rounded-xl p-6 border border-[#1f2123]">
          <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES.map((badge) => (
              <div 
                key={badge.id}
                className="p-4 rounded-xl bg-[#1a1c1c] border border-[#2a2c2c] text-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <div 
                  className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  <badge.icon className="w-5 h-5" style={{ color: badge.color }} />
                </div>
                <p className="text-sm text-[#e2e8f0]">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
