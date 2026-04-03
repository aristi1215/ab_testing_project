export interface LandingPageTest {
  id: string;
  name: string;
  status: 'draft' | 'live' | 'completed';
  createdAt: Date;
  variants: LandingPageVariant[];
  interactions: InteractionData[];
}

export interface LandingPageVariant {
  id: string;
  name: string;
  // Content
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaColor: string;
  imageUrl: string;
  backgroundColor: string;
  // Stats
  views: number;
  clicks: number;
  ctr: number; // click-through rate
}

export interface InteractionData {
  variantId: string;
  timestamp: Date;
  type: 'view' | 'click';
}
