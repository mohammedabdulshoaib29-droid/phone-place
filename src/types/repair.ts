export type RepairServiceType = 'walk-in' | 'pickup' | 'doorstep';

export type RepairIssueType =
  | 'screen'
  | 'battery'
  | 'charging-port'
  | 'speaker'
  | 'camera'
  | 'water-damage'
  | 'software'
  | 'other';

export type RepairStatus =
  | 'booking-received'
  | 'device-collected'
  | 'under-inspection'
  | 'quote-sent'
  | 'waiting-for-approval'
  | 'repair-in-progress'
  | 'quality-check'
  | 'ready-for-pickup'
  | 'delivered';

export type ApprovalStatus = 'pending' | 'approved' | 'not-required';
export type RepairPaymentStatus = 'pending' | 'partially-paid' | 'paid';

export interface RepairTimelineItem {
  status: RepairStatus;
  title: string;
  note: string;
  timestamp: string;
}

export interface RepairBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  problemType: RepairIssueType;
  issueDescription: string;
  photos: string[];
  serviceType: RepairServiceType;
  preferredDate: string;
  preferredTime: string;
  address?: string;
  locationLabel: string;
  status: RepairStatus;
  timeline: RepairTimelineItem[];
  estimatedCompletionDate: string;
  technicianNotes: string;
  costEstimate: number;
  approvalStatus: ApprovalStatus;
  paymentStatus: RepairPaymentStatus;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}
