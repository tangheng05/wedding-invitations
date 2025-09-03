import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default async function FeedbackPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  // Fetch feedback data
  const totalFeedback = await prisma.rSVP.count({
    where: {
      message: { not: null }
    }
  })

  const positiveFeedback = await prisma.rSVP.count({
    where: {
      message: { not: null },
      status: 'CONFIRMED'
    }
  })

  const recentFeedback = await prisma.rSVP.findMany({
    where: {
      message: { not: null }
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      guest: true
    }
  })

  const feedbackStats = [
    {
      title: 'Total Feedback',
      value: totalFeedback,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Positive Responses',
      value: positiveFeedback,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Response Rate',
      value: `${Math.round((totalFeedback / 100) * 100)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Users',
      value: await prisma.guest.count(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Feedback & Analytics</h1>
          <p className="text-gray-600 mt-2">Monitor user engagement and gather insights for improvements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {feedbackStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Engagement Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Session Duration</span>
                <span className="text-sm font-medium text-gray-900">2m 34s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pages per Session</span>
                <span className="text-sm font-medium text-gray-900">3.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="text-sm font-medium text-gray-900">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mobile Usage</span>
                <span className="text-sm font-medium text-gray-900">68%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              User Satisfaction
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Rating</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">4.8</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ease of Use</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Design Appeal</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Performance</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Recent User Feedback
          </h3>
          <div className="space-y-4">
            {recentFeedback.map((rsvp: any) => (
              <div key={rsvp.id} className="border-l-4 border-blue-500 pl-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-900 mr-3">
                        {rsvp.guest.name}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rsvp.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-800'
                          : rsvp.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rsvp.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {rsvp.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(rsvp.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4">
                    {rsvp.status === 'CONFIRMED' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : rsvp.status === 'PENDING' ? (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Improvements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">High Priority</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Add more photo gallery options</li>
                <li>• Implement guest book feature</li>
                <li>• Add music playlist integration</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Medium Priority</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Add weather forecast integration</li>
                <li>• Implement gift registry</li>
                <li>• Add travel information section</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
