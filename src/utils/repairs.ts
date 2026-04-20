import type {
  RepairBooking,
  RepairIssueType,
  RepairServiceType,
  RepairStatus,
  RepairTimelineItem,
} from '../types/repair';

const STORAGE_KEY = 'phone-palace-repairs';

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
  'booking-received': 'Booking Received',
  'device-collected': 'Device Collected',
  'under-inspection': 'Under Inspection',
  'quote-sent': 'Quote Sent',
  'waiting-for-approval': 'Waiting for Approval',
  'repair-in-progress': 'Repair in Progress',
  'quality-check': 'Quality Check',
  'ready-for-pickup': 'Ready for Pickup',
  delivered: 'Delivered',
};

export const REPAIR_STATUS_ORDER: RepairStatus[] = [
  'booking-received',
  'device-collected',
  'under-inspection',
  'quote-sent',
  'waiting-for-approval',
  'repair-in-progress',
  'quality-check',
  'ready-for-pickup',
  'delivered',
];

export const REPAIR_ISSUE_LABELS: Record<RepairIssueType, string> = {
  screen: 'Screen Repair',
  battery: 'Battery Replacement',
  'charging-port': 'Charging Port',
  speaker: 'Speaker / Mic',
  camera: 'Camera Repair',
  'water-damage': 'Water Damage',
  software: 'Software Issue',
  other: 'Other',
};

export const SERVICE_TYPE_LABELS: Record<RepairServiceType, string> = {
  'walk-in': 'Walk-in Service',
  pickup: 'Pickup Service',
  doorstep: 'Doorstep Service',
};

const demoRepairs: RepairBooking[] = [
  {
    id: 'RPR-20260420-1842',
    customerName: 'Rahul Verma',
    phone: '9876543210',
    email: 'rahul.verma@example.com',
    brand: 'Apple',
    model: 'iPhone 13',
    problemType: 'screen',
    issueDescription: 'Front glass cracked after a drop. Touch still works but display has green lines.',
    photos: ['front-crack.jpg', 'display-lines.jpg'],
    serviceType: 'pickup',
    preferredDate: '2026-04-20',
    preferredTime: '11:30',
    address: 'Amberpet Main Road, Hyderabad, Telangana 500013',
    locationLabel: 'Pickup Scheduled',
    status: 'repair-in-progress',
    timeline: [
      createTimelineItem('booking-received', '2026-04-20T09:15:00.000Z', 'Repair request created online.'),
      createTimelineItem('device-collected', '2026-04-20T10:40:00.000Z', 'Runner collected the device from the customer location.'),
      createTimelineItem('under-inspection', '2026-04-20T11:30:00.000Z', 'Display assembly and frame damage inspected.'),
      createTimelineItem('quote-sent', '2026-04-20T12:05:00.000Z', 'Estimate shared over WhatsApp and SMS.'),
      createTimelineItem('waiting-for-approval', '2026-04-20T12:15:00.000Z', 'Awaiting customer confirmation for OEM screen replacement.'),
      createTimelineItem('repair-in-progress', '2026-04-20T13:20:00.000Z', 'Screen replacement started after approval.'),
    ],
    estimatedCompletionDate: '2026-04-20',
    technicianNotes: 'Mid-frame is fine. Face ID and earpiece tested OK after assembly.',
    costEstimate: 5499,
    approvalStatus: 'approved',
    paymentStatus: 'pending',
    createdAt: '2026-04-20T09:15:00.000Z',
    updatedAt: '2026-04-20T13:20:00.000Z',
    isDemo: true,
  },
  {
    id: 'RPR-20260419-1027',
    customerName: 'Sneha Reddy',
    phone: '9988776655',
    email: 'sneha.reddy@example.com',
    brand: 'Samsung',
    model: 'Galaxy S22',
    problemType: 'battery',
    issueDescription: 'Battery drops from 40% to 5% in less than one hour.',
    photos: ['battery-health.jpg'],
    serviceType: 'walk-in',
    preferredDate: '2026-04-19',
    preferredTime: '16:00',
    locationLabel: 'Walk-in Desk',
    status: 'ready-for-pickup',
    timeline: [
      createTimelineItem('booking-received', '2026-04-19T08:05:00.000Z', 'Walk-in booking created from the front desk.'),
      createTimelineItem('device-collected', '2026-04-19T16:02:00.000Z', 'Device checked in at the service counter.'),
      createTimelineItem('under-inspection', '2026-04-19T16:25:00.000Z', 'Battery health tested and backup issue confirmed.'),
      createTimelineItem('quote-sent', '2026-04-19T16:40:00.000Z', 'Battery replacement quote generated.'),
      createTimelineItem('waiting-for-approval', '2026-04-19T16:45:00.000Z', 'Customer reviewing estimate at the counter.'),
      createTimelineItem('repair-in-progress', '2026-04-19T17:00:00.000Z', 'Battery replacement initiated.'),
      createTimelineItem('quality-check', '2026-04-19T18:10:00.000Z', 'Charge cycle and heating test completed.'),
      createTimelineItem('ready-for-pickup', '2026-04-19T18:35:00.000Z', 'Customer notified that device is ready.'),
    ],
    estimatedCompletionDate: '2026-04-19',
    technicianNotes: 'Battery cell replaced. Updated charging calibration before handover.',
    costEstimate: 2499,
    approvalStatus: 'approved',
    paymentStatus: 'partially-paid',
    createdAt: '2026-04-19T08:05:00.000Z',
    updatedAt: '2026-04-19T18:35:00.000Z',
    isDemo: true,
  },
];

interface CreateRepairBookingInput {
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
}

function createTimelineItem(status: RepairStatus, timestamp: string, note: string): RepairTimelineItem {
  return {
    status,
    title: REPAIR_STATUS_LABELS[status],
    note,
    timestamp,
  };
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function readStoredRepairs(): RepairBooking[] {
  const storage = getStorage();
  if (!storage) {
    return demoRepairs;
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    storage.setItem(STORAGE_KEY, JSON.stringify(demoRepairs));
    return demoRepairs;
  }

  try {
    const parsed = JSON.parse(raw) as RepairBooking[];
    return Array.isArray(parsed) ? parsed : demoRepairs;
  } catch {
    storage.setItem(STORAGE_KEY, JSON.stringify(demoRepairs));
    return demoRepairs;
  }
}

function writeStoredRepairs(repairs: RepairBooking[]) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(repairs));
}

export function getRepairBookings() {
  return readStoredRepairs().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getRepairBookingsForPhone(phone?: string | null) {
  if (!phone) {
    return [];
  }

  return getRepairBookings().filter((repair) => normalizePhone(repair.phone) === normalizePhone(phone));
}

export function getRepairBookingById(repairId: string) {
  return getRepairBookings().find((repair) => repair.id.toLowerCase() === repairId.trim().toLowerCase()) ?? null;
}

export function findRepairBooking(repairId: string, phone: string) {
  const normalizedPhone = normalizePhone(phone);

  return (
    getRepairBookings().find(
      (repair) =>
        repair.id.toLowerCase() === repairId.trim().toLowerCase() &&
        normalizePhone(repair.phone) === normalizedPhone
    ) ?? null
  );
}

export function createRepairBooking(input: CreateRepairBookingInput) {
  const repairs = getRepairBookings();
  const now = new Date();
  const repairId = generateRepairId(now);
  const estimatedCompletionDate = input.preferredDate || new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const locationLabel =
    input.serviceType === 'walk-in'
      ? 'Walk-in Service'
      : input.serviceType === 'pickup'
        ? 'Pickup Requested'
        : 'Doorstep Visit Requested';

  const repair: RepairBooking = {
    id: repairId,
    customerName: input.customerName.trim(),
    phone: normalizePhone(input.phone),
    email: input.email.trim(),
    brand: input.brand.trim(),
    model: input.model.trim(),
    problemType: input.problemType,
    issueDescription: input.issueDescription.trim(),
    photos: input.photos,
    serviceType: input.serviceType,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    address: input.address?.trim(),
    locationLabel,
    status: 'booking-received',
    timeline: [
      createTimelineItem(
        'booking-received',
        now.toISOString(),
        `Booking confirmed for ${SERVICE_TYPE_LABELS[input.serviceType].toLowerCase()}.`
      ),
    ],
    estimatedCompletionDate,
    technicianNotes: 'Device awaiting intake inspection. Technician notes will appear after diagnostic check.',
    costEstimate: getDefaultEstimate(input.problemType),
    approvalStatus: 'pending',
    paymentStatus: 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  writeStoredRepairs([repair, ...repairs]);
  return repair;
}

function generateRepairId(now: Date) {
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `RPR-${datePart}-${randomPart}`;
}

function getDefaultEstimate(problemType: RepairIssueType) {
  const estimates: Record<RepairIssueType, number> = {
    screen: 5499,
    battery: 2499,
    'charging-port': 1999,
    speaker: 1499,
    camera: 3299,
    'water-damage': 3999,
    software: 999,
    other: 1499,
  };

  return estimates[problemType];
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '').slice(-10);
}
