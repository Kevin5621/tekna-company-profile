"use client"

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AnalyticsClientService } from '@/lib/services/analytics.client'

interface AnalyticsTrackerProps {
  children: React.ReactNode
}

export function AnalyticsTracker({ children }: AnalyticsTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionIdRef = useRef<string>('')
  const pageStartTimeRef = useRef<number>(Date.now())
  const scrollDepthRef = useRef<number>(0)

  // Generate or retrieve session ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to get existing session ID from localStorage
      let sessionId = localStorage.getItem('analytics_session_id')
      
      if (!sessionId) {
        // Generate new session ID
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('analytics_session_id', sessionId)
      }
      
      sessionIdRef.current = sessionId || ''

      // Create or update session
      const createSession = async () => {
        try {
          const userAgent = navigator.userAgent
          const referrer = document.referrer
          const urlParams = new URLSearchParams(window.location.search)
          
          // Detect device type
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
          const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)
          const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

          // Detect browser
          let browser = 'Unknown'
          if (userAgent.includes('Chrome')) browser = 'Chrome'
          else if (userAgent.includes('Firefox')) browser = 'Firefox'
          else if (userAgent.includes('Safari')) browser = 'Safari'
          else if (userAgent.includes('Edge')) browser = 'Edge'

          // Detect OS
          let os = 'Unknown'
          if (userAgent.includes('Windows')) os = 'Windows'
          else if (userAgent.includes('Mac')) os = 'macOS'
          else if (userAgent.includes('Linux')) os = 'Linux'
          else if (userAgent.includes('Android')) os = 'Android'
          else if (userAgent.includes('iOS')) os = 'iOS'

          if (sessionId) {
            await AnalyticsClientService.createOrUpdateSession({
              sessionId: sessionId,
              userAgent,
              referrer,
              utmSource: urlParams.get('utm_source') || undefined,
              utmMedium: urlParams.get('utm_medium') || undefined,
              utmCampaign: urlParams.get('utm_campaign') || undefined,
              deviceType,
              browser,
              os
            })
          }
        } catch (error) {
          console.error('Error creating session:', error)
        }
      }

      createSession()
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionIdRef.current) {
      const trackPageView = async () => {
        try {
          // Reset page tracking
          pageStartTimeRef.current = Date.now()
          scrollDepthRef.current = 0

          // Determine page type
          let pageType = 'other'
          if (pathname === '/') pageType = 'home'
          else if (pathname.startsWith('/blog')) pageType = 'blog'
          else if (pathname.startsWith('/career')) pageType = 'career'
          else if (pathname.startsWith('/about')) pageType = 'about'
          else if (pathname.startsWith('/contact')) pageType = 'contact'
          else if (pathname.startsWith('/projects')) pageType = 'projects'

          await AnalyticsClientService.recordPageView({
            sessionId: sessionIdRef.current,
            pagePath: pathname,
            pageTitle: document.title,
            pageType,
            referrerPath: document.referrer ? new URL(document.referrer).pathname : undefined
          })
        } catch (error) {
          console.error('Error tracking page view:', error)
        }
      }

      trackPageView()
    }
  }, [pathname, searchParams])

  // Track scroll depth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100)
        
        if (scrollPercentage > scrollDepthRef.current) {
          scrollDepthRef.current = scrollPercentage
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Track page exit and time on page
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionIdRef.current) {
      const handleBeforeUnload = async () => {
        try {
          const timeOnPage = Math.round((Date.now() - pageStartTimeRef.current) / 1000)
          
          await AnalyticsClientService.recordPageView({
            sessionId: sessionIdRef.current,
            pagePath: pathname,
            pageTitle: document.title,
            timeOnPage,
            scrollDepth: scrollDepthRef.current,
            isExit: true
          })

          // End session if user is leaving the site
          await AnalyticsClientService.endSession(sessionIdRef.current, timeOnPage)
        } catch (error) {
          console.error('Error tracking page exit:', error)
        }
      }

      const handleVisibilityChange = async () => {
        if (document.visibilityState === 'hidden') {
          try {
            const timeOnPage = Math.round((Date.now() - pageStartTimeRef.current) / 1000)
            
            await AnalyticsClientService.recordPageView({
              sessionId: sessionIdRef.current,
              pagePath: pathname,
              pageTitle: document.title,
              timeOnPage,
              scrollDepth: scrollDepthRef.current,
              isExit: false
            })
          } catch (error) {
            console.error('Error tracking visibility change:', error)
          }
        }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [pathname])

  return <>{children}</>
}
