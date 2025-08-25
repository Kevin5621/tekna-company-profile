'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Clock, 
  Star,
  Users,
  Building,
  Send,
  Share2,
  Eye,
  UserPlus,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CareerService, CareerPosition } from "@/lib/services/career"

interface CareerPositionClientProps {
  slug: string
}

export default function CareerPositionClient({ slug }: CareerPositionClientProps) {
  const [position, setPosition] = useState<CareerPosition | null>(null)
  const [relatedPositions, setRelatedPositions] = useState<CareerPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume_url: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    source: 'website'
  })

  const careerService = useMemo(() => new CareerService(), [])

  const loadPosition = useCallback(async () => {
    setLoading(true)
    try {
      const positionData = await careerService.getPublicPositionBySlug(slug)
      if (!positionData) {
        notFound()
      }
      setPosition(positionData)
      
      // Load related positions
      if (positionData.category) {
        const related = await careerService.getRelatedPositions(positionData.id, positionData.category.id, 3)
        setRelatedPositions(related)
      }
    } catch (error) {
      console.error('Error loading position:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }, [careerService, slug])

  useEffect(() => {
    loadPosition()
  }, [loadPosition])

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!position) return

    setApplying(true)
    try {
      const application = {
        position_id: position.id,
        ...applicationData
      }

      const success = await careerService.submitApplication(application)
      
      if (success) {
        setShowApplicationForm(false)
        setApplicationData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          cover_letter: '',
          resume_url: '',
          portfolio_url: '',
          linkedin_url: '',
          github_url: '',
          source: 'website'
        })
        alert('Application submitted successfully!')
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return 'Competitive salary'
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`
    } else if (min) {
      return `From ${formatter.format(min)}`
    } else if (max) {
      return `Up to ${formatter.format(max)}`
    }
    
    return 'Competitive salary'
  }

  const sharePosition = async () => {
    if (navigator.share && position) {
      try {
        await navigator.share({
          title: position.title,
          text: position.description.substring(0, 100) + '...',
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert('Position URL copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Position not found</h1>
            <p className="text-muted-foreground mt-2">The job position you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/career" className="mt-4 inline-block">
              <Button>Browse All Positions</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/career">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Careers
              </Button>
            </Link>
          </div>

          {/* Position Header */}
          <Card className="border-0 shadow-md">
            <CardHeader className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {position.featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                    {position.urgent && (
                      <Badge variant="destructive">
                        <Clock className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                    <Badge variant={
                      position.status === 'open' ? 'default' : 
                      position.status === 'closed' ? 'secondary' : 
                      'outline'
                    }>
                      {position.status}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900">{position.title}</h1>
                  
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{position.category?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{position.location?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{position.type?.name}</span>
                    </div>
                    {position.remote_allowed && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Remote Friendly
                      </Badge>
                    )}
                  </div>

                  <div className="text-lg font-semibold text-primary">
                    {formatSalary(position.salary_min, position.salary_max, position.salary_currency)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={sharePosition}
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    onClick={() => setShowApplicationForm(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{position.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {position.requirements && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{position.requirements}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {position.benefits && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{position.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Position Details */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Position Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Department</div>
                    <div className="mt-1">{position.category?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Location</div>
                    <div className="mt-1">{position.location?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Employment Type</div>
                    <div className="mt-1">{position.type?.name}</div>
                  </div>
                  {position.level && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Experience Level</div>
                      <div className="mt-1">{position.level.name}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-500">Posted</div>
                    <div className="mt-1">{new Date(position.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {position.views_count} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {position.applications_count} applications
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Apply Button */}
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <Button 
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Apply for this Position
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Join our team and make a difference
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Application Form Modal */}
          {showApplicationForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Apply for {position.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleApplication} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name *</label>
                        <Input
                          value={applicationData.first_name}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, first_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name *</label>
                        <Input
                          value={applicationData.last_name}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, last_name: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        type="email"
                        value={applicationData.email}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <Input
                        type="tel"
                        value={applicationData.phone}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Cover Letter</label>
                      <Textarea
                        value={applicationData.cover_letter}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, cover_letter: e.target.value }))}
                        rows={4}
                        placeholder="Tell us why you're perfect for this role..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Resume URL</label>
                      <Input
                        type="url"
                        value={applicationData.resume_url}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, resume_url: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Portfolio URL</label>
                        <Input
                          type="url"
                          value={applicationData.portfolio_url}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                        <Input
                          type="url"
                          value={applicationData.linkedin_url}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub URL</label>
                      <Input
                        type="url"
                        value={applicationData.github_url}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, github_url: e.target.value }))}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowApplicationForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={applying}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Related Positions */}
          {relatedPositions.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Related Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPositions.map((relatedPosition) => (
                    <div key={relatedPosition.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <Link href={`/career/${relatedPosition.slug}`} className="block">
                        <h3 className="font-medium hover:text-primary transition-colors">
                          {relatedPosition.title}
                        </h3>
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        {relatedPosition.location?.name} • {relatedPosition.type?.name}
                      </div>
                      <div className="text-sm font-medium text-primary mt-1">
                        {formatSalary(relatedPosition.salary_min, relatedPosition.salary_max, relatedPosition.salary_currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
