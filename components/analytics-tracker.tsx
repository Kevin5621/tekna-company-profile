"use client"

// NOTE: Analytics tracking is disabled - Coming Soon
// All analytics functionality is commented out until future implementation

interface AnalyticsTrackerProps {
  children: React.ReactNode
}

export function AnalyticsTracker({ children }: AnalyticsTrackerProps) {
  // Analytics tracking is disabled - Coming Soon
  console.log('📊 [AnalyticsTracker] Analytics tracking disabled - Coming Soon');

  return <>{children}</>
}
