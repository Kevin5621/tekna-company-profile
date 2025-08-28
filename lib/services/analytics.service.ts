// Google Analytics 4 Service untuk PT Sapujagat Nirmana Tekna
// File ini berisi konfigurasi dan tracking events untuk SEO monitoring

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_referrer?: string;
}

export interface ConversionEvent {
  event_name: string;
  parameters: Record<string, string | number | boolean>;
}

class AnalyticsService {
  private measurementId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  }

  // Initialize Google Analytics
  initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(command: string, targetId: string | Date, config?: Record<string, unknown>) {
      window.dataLayer.push([command, targetId, config].filter(Boolean));
    };

    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer,
      custom_map: {
        'custom_parameter_1': 'company_name',
        'custom_parameter_2': 'service_type',
        'custom_parameter_3': 'location',
      },
    });

    this.isInitialized = true;
    console.log('📊 Google Analytics initialized for PT Sapujagat Nirmana Tekna');
  }

  // Track page views
  trackPageView(pageData: PageViewEvent): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'page_view', {
      page_title: pageData.page_title,
      page_location: pageData.page_location,
      page_referrer: pageData.page_referrer,
      company_name: 'PT Sapujagat Nirmana Tekna',
      service_type: 'Software Development',
      location: 'Indonesia',
    });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      company_name: 'PT Sapujagat Nirmana Tekna',
      service_type: 'Software Development',
      location: 'Indonesia',
    });
  }

  // Track conversions (contact form, phone calls, etc.)
  trackConversion(conversion: ConversionEvent): void {
    if (!this.isInitialized) return;

    window.gtag('event', conversion.event_name, {
      ...conversion.parameters,
      company_name: 'PT Sapujagat Nirmana Tekna',
      service_type: 'Software Development',
      location: 'Indonesia',
    });
  }

  // Track service inquiries
  trackServiceInquiry(serviceType: 'iot' | 'mobile' | 'web'): void {
    this.trackEvent({
      action: 'service_inquiry',
      category: 'engagement',
      label: serviceType,
      value: 1,
    });
  }

  // Track contact form submissions
  trackContactForm(): void {
    this.trackEvent({
      action: 'contact_form_submit',
      category: 'lead_generation',
      label: 'contact_form',
      value: 1,
    });
  }

  // Track portfolio views
  trackPortfolioView(projectName: string): void {
    this.trackEvent({
      action: 'portfolio_view',
      category: 'engagement',
      label: projectName,
      value: 1,
    });
  }

  // Track blog engagement
  trackBlogEngagement(action: 'view' | 'share' | 'comment', postTitle: string): void {
    this.trackEvent({
      action: `blog_${action}`,
      category: 'content_engagement',
      label: postTitle,
      value: 1,
    });
  }

  // Track local search queries
  trackLocalSearch(query: string): void {
    this.trackEvent({
      action: 'local_search',
      category: 'local_seo',
      label: query,
      value: 1,
    });
  }

  // Track phone number clicks
  trackPhoneClick(): void {
    this.trackEvent({
      action: 'phone_click',
      category: 'contact',
      label: 'phone_number',
      value: 1,
    });
  }

  // Track email clicks
  trackEmailClick(): void {
    this.trackEvent({
      action: 'email_click',
      category: 'contact',
      label: 'email_address',
      value: 1,
    });
  }

  // Track social media clicks
  trackSocialMediaClick(platform: string): void {
    this.trackEvent({
      action: 'social_media_click',
      category: 'social_engagement',
      label: platform,
      value: 1,
    });
  }

  // Track career page views
  trackCareerPageView(): void {
    this.trackEvent({
      action: 'career_page_view',
      category: 'recruitment',
      label: 'career_page',
      value: 1,
    });
  }

  // Track job applications
  trackJobApplication(position: string): void {
    this.trackEvent({
      action: 'job_application',
      category: 'recruitment',
      label: position,
      value: 1,
    });
  }

  // Track partner inquiries
  trackPartnerInquiry(): void {
    this.trackEvent({
      action: 'partner_inquiry',
      category: 'partnership',
      label: 'partner_form',
      value: 1,
    });
  }

  // Get analytics data (for dashboard)
  getAnalyticsData(): Promise<{
    totalUsers: number;
    pageViews: number;
    conversions: number;
    topPages: Array<{ page: string; views: number }>;
    topKeywords: Array<{ keyword: string; searches: number }>;
  }> {
    // This would typically call Google Analytics API
    // For now, return mock data
    return Promise.resolve({
      totalUsers: 0,
      pageViews: 0,
      conversions: 0,
      topPages: [],
      topKeywords: [],
    });
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export types for global use
declare global {
  interface Window {
    gtag: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
    dataLayer: Array<unknown>;
  }
}

export default AnalyticsService;
