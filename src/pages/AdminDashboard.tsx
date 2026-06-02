import { useState } from 'react'
import { Navigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { 
  Users, 
  BookOpen, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3,
  Shield,
  Mail,
  Eye,
  Check,
  X,
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Redirect non-admin users
  if (!authLoading && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />
  }

  const { data: stats } = trpc.user.stats.useQuery(undefined, {
    enabled: user?.role === 'admin',
  })
  const { data: usersData } = trpc.user.list.useQuery({}, {
    enabled: user?.role === 'admin' && activeTab === 'users',
  })
  const { data: kobjectsData } = trpc.kobject.adminList.useQuery(undefined, {
    enabled: user?.role === 'admin' && activeTab === 'kobjects',
  })
  const { data: messagesData } = trpc.message.list.useQuery({}, {
    enabled: user?.role === 'admin' && activeTab === 'messages',
  })

  const updateRoleMutation = trpc.user.updateRole.useMutation({
    onSuccess: () => toast.success('User role updated'),
    onError: (err) => toast.error(err.message),
  })

  const moderateMutation = trpc.kobject.moderate.useMutation({
    onSuccess: () => toast.success('K-Object status updated'),
    onError: (err) => toast.error(err.message),
  })

  const markReadMutation = trpc.message.markRead.useMutation({
    onSuccess: () => toast.success('Message marked as read'),
  })

  const resolveMutation = trpc.message.resolve.useMutation({
    onSuccess: () => toast.success('Message resolved'),
  })

  const deleteMessageMutation = trpc.message.delete.useMutation({
    onSuccess: () => toast.success('Message deleted'),
  })

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
    { label: 'K-Objects', value: stats?.totalKObjects || 0, icon: BookOpen, color: 'text-[#10b981]', bg: 'bg-[#10b981]/10' },
    { label: 'Purchases', value: stats?.totalPurchases || 0, icon: ShoppingCart, color: 'text-[#fbbf24]', bg: 'bg-[#fbbf24]/10' },
    { label: 'Messages', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'text-[#e63946]', bg: 'bg-[#e63946]/10' },
    { label: 'Unread', value: stats?.unreadMessages || 0, icon: Mail, color: 'text-[#f97316]', bg: 'bg-[#f97316]/10' },
    { label: 'Revenue (ETH)', value: Number(stats?.totalRevenue || 0).toFixed(4), icon: BarChart3, color: 'text-[#a855f7]', bg: 'bg-[#a855f7]/10' },
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#e63946]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Control Center
            </h1>
            <p className="text-sm text-[#6b7280]">Manage users, content, and system analytics</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-[#121414] rounded-xl p-4 border border-[#1f2123]">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#6b7280]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#121414] border border-[#1f2123] mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#e63946] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#e63946] data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="kobjects" className="data-[state=active]:bg-[#e63946] data-[state=active]:text-white">
              K-Objects
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#e63946] data-[state=active]:text-white">
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="bg-[#121414] rounded-xl p-6 border border-[#1f2123]">
              <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#1f2123]">
                    <span className="text-[#6b7280]">Total Platform Revenue</span>
                    <span className="text-[#fbbf24] font-bold">{Number(stats?.totalRevenue || 0).toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#1f2123]">
                    <span className="text-[#6b7280]">Chat Interactions</span>
                    <span className="text-white font-medium">{stats?.totalChatMessages || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#1f2123]">
                    <span className="text-[#6b7280]">Conversion Rate</span>
                    <span className="text-[#10b981] font-medium">
                      {stats?.totalUsers ? ((stats.totalPurchases / stats.totalUsers) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                <div className="bg-[#1a1c1c] rounded-lg p-4 border border-[#2a2c2c]">
                  <h4 className="text-sm font-medium text-white mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                      <span className="text-[#e2e8f0]">Platform is operational</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                      <span className="text-[#e2e8f0]">{stats?.totalUsers || 0} registered scholars</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                      <span className="text-[#e2e8f0]">{stats?.totalKObjects || 0} knowledge objects indexed</span>
                    </div>
                    {stats && stats.unreadMessages > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-[#e63946]" />
                        <span className="text-[#e63946]">{stats.unreadMessages} unread messages</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-[#121414] rounded-xl border border-[#1f2123] overflow-hidden">
              <div className="p-4 border-b border-[#1f2123] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">All Users</h3>
                <span className="text-sm text-[#6b7280]">{usersData?.total || 0} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a1c1c]">
                    <tr>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">User</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Email</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Role</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Joined</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2123]">
                    {usersData?.items.map((u) => (
                      <tr key={u.id} className="hover:bg-[#1a1c1c]/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img src={u.avatar || '/images/avatar-1.jpg'} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <span className="text-sm text-white">{u.name || 'Anonymous'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#e2e8f0]">{u.email || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                            u.role === 'admin' 
                              ? 'bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/30' 
                              : 'bg-[#1a1c1c] text-[#e2e8f0] border border-[#2a2c2c]'
                          }`}>
                            <Shield className="w-3 h-3" />
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6b7280]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateRoleMutation.mutate({ 
                              id: u.id, 
                              role: u.role === 'admin' ? 'user' : 'admin' 
                            })}
                            className="text-xs text-[#6b7280] hover:text-[#e63946]"
                          >
                            Toggle Role
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* K-Objects Tab */}
          <TabsContent value="kobjects">
            <div className="bg-[#121414] rounded-xl border border-[#1f2123] overflow-hidden">
              <div className="p-4 border-b border-[#1f2123] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">All Knowledge Objects</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a1c1c]">
                    <tr>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Title</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Price</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Trust</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2123]">
                    {kobjectsData?.map((ko) => (
                      <tr key={ko.id} className="hover:bg-[#1a1c1c]/50">
                        <td className="px-4 py-3 text-sm text-white">{ko.title}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-[#1a1c1c] text-[#e2e8f0] px-2 py-1 rounded">{ko.type}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#fbbf24]">
                          {Number(ko.price) > 0 ? `${ko.price} ETH` : 'Free'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                            ko.status === 'published' ? 'bg-[#10b981]/10 text-[#10b981]' :
                            ko.status === 'under_review' ? 'bg-[#fbbf24]/10 text-[#fbbf24]' :
                            ko.status === 'rejected' ? 'bg-[#e63946]/10 text-[#e63946]' :
                            'bg-[#1a1c1c] text-[#6b7280]'
                          }`}>
                            {ko.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#fbbf24]">{Number(ko.trustScore).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {ko.status !== 'published' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moderateMutation.mutate({ id: ko.id, status: 'published' })}
                                className="text-xs text-[#10b981] hover:text-[#10b981]"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            {ko.status !== 'rejected' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moderateMutation.mutate({ id: ko.id, status: 'rejected' })}
                                className="text-xs text-[#e63946] hover:text-[#e63946]"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="bg-[#121414] rounded-xl border border-[#1f2123] overflow-hidden">
              <div className="p-4 border-b border-[#1f2123] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Contact Messages</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a1c1c]">
                    <tr>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">From</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Subject</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Message</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2123]">
                    {messagesData?.items.map((msg) => (
                      <tr key={msg.id} className="hover:bg-[#1a1c1c]/50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-white">{msg.name}</p>
                            <p className="text-xs text-[#6b7280]">{msg.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#e2e8f0]">{msg.subject}</td>
                        <td className="px-4 py-3 text-sm text-[#e2e8f0] max-w-[200px] truncate">{msg.message}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                            msg.status === 'unread' ? 'bg-[#e63946]/10 text-[#e63946]' :
                            msg.status === 'read' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' :
                            'bg-[#10b981]/10 text-[#10b981]'
                          }`}>
                            {msg.status === 'unread' && <Clock className="w-3 h-3" />}
                            {msg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {msg.status === 'unread' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markReadMutation.mutate({ id: msg.id })}
                                className="text-xs text-[#3b82f6]"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            )}
                            {msg.status !== 'resolved' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => resolveMutation.mutate({ id: msg.id })}
                                className="text-xs text-[#10b981]"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm('Delete this message?')) {
                                  deleteMessageMutation.mutate({ id: msg.id })
                                }
                              }}
                              className="text-xs text-[#e63946]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {messagesData && messagesData.items.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-[#2a2c2c] mx-auto mb-3" />
                  <p className="text-[#6b7280]">No messages yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
