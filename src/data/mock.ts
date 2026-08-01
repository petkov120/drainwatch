export type IssueType = 'flooded' | 'blocked' | 'dumping'
export type ReportStatus = 'received' | 'in_progress' | 'resolved'
export type Severity = 'low' | 'moderate' | 'high' | 'critical'
export type AccessibilityImpact = 'none' | 'partial' | 'blocked'
export type VerificationLevel = 'unverified' | 'community' | 'verified'

export interface Comment {
  id: string
  author: string
  text: string
  time: string
  isOfficial?: boolean
}

export interface TimelineEvent {
  id: string
  type: 'reported' | 'confirmed' | 'gov_response' | 'in_progress' | 'resolved' | 'photo_added'
  title: string
  description?: string
  timestamp: string
  actor?: string
}

export interface GovResponse {
  id: string
  agency: string
  message: string
  timestamp: string
}

export interface Report {
  id: string
  type: IssueType
  status: ReportStatus
  severity: Severity
  accessibilityImpact: AccessibilityImpact
  avoidArea: boolean
  title: string
  summary: string
  location: string
  lga: string
  reportedAt: string
  confirmations: number
  photoCount: number
  photoUrl?: string
  lat: number
  lng: number
  comments: Comment[]
  timeline: TimelineEvent[]
  govResponses: GovResponse[]
}

export const issueTypeLabels: Record<IssueType, string> = {
  flooded: 'Flooded road',
  blocked: 'Blocked drain',
  dumping: 'Illegal dumping',
}

export const issueTypeDescriptions: Record<IssueType, string> = {
  flooded: 'Water covering the road surface',
  blocked: 'Drain blocked or overflowing',
  dumping: 'Waste blocking drainage channels',
}

export const statusLabels: Record<ReportStatus, string> = {
  received: 'Received',
  in_progress: 'In progress',
  resolved: 'Resolved',
}

export const severityLabels: Record<Severity, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  critical: 'Critical',
}

export const accessibilityLabels: Record<AccessibilityImpact, string> = {
  none: 'No impact',
  partial: 'Partial access',
  blocked: 'Access blocked',
}

export const mockReports: Report[] = [
  {
    id: 'FW-2847',
    type: 'flooded',
    status: 'received',
    severity: 'high',
    accessibilityImpact: 'blocked',
    avoidArea: true,
    title: 'Flooded road on Admiralty Way',
    summary:
      'Water covering both lanes after rainfall. Pedestrian paths impassable. Wheelchair access blocked at junction.',
    location: 'Admiralty Way, Lekki Phase 1',
    lga: 'Eti-Osa',
    reportedAt: '31 Jul 2026, 09:14',
    confirmations: 12,
    photoCount: 3,
    lat: 6.4474,
    lng: 3.4738,
    comments: [
      {
        id: 'c1',
        author: 'Citizen',
        text: 'Still flooded after the rain stopped. Cannot push stroller through.',
        time: '1 hour ago',
      },
      {
        id: 'c2',
        author: 'Citizen',
        text: 'Traffic diverted through side street.',
        time: '45 minutes ago',
      },
    ],
    timeline: [
      {
        id: 't1',
        type: 'reported',
        title: 'Report submitted',
        description: 'Citizen report with 3 photos',
        timestamp: '31 Jul 2026, 09:14',
        actor: 'Citizen reporter',
      },
      {
        id: 't2',
        type: 'confirmed',
        title: '12 community confirmations',
        description: 'Multiple residents verified flooding',
        timestamp: '31 Jul 2026, 10:30',
      },
    ],
    govResponses: [],
  },
  {
    id: 'FW-2843',
    type: 'blocked',
    status: 'in_progress',
    severity: 'moderate',
    accessibilityImpact: 'partial',
    avoidArea: false,
    title: 'Blocked drain on Bode Thomas',
    summary:
      'Drain cover missing near junction. Water pooling during light rain. Sidewalk partially passable.',
    location: 'Bode Thomas Street, Surulere',
    lga: 'Surulere',
    reportedAt: '30 Jul 2026, 16:42',
    confirmations: 8,
    photoCount: 2,
    lat: 6.4969,
    lng: 3.355,
    comments: [],
    timeline: [
      {
        id: 't1',
        type: 'reported',
        title: 'Report submitted',
        timestamp: '30 Jul 2026, 16:42',
        actor: 'Citizen reporter',
      },
      {
        id: 't2',
        type: 'gov_response',
        title: 'Lagos Waste Management notified',
        timestamp: '30 Jul 2026, 18:00',
        actor: 'LAWMA',
      },
      {
        id: 't3',
        type: 'in_progress',
        title: 'Crew dispatched',
        description: 'Drainage team en route to Bode Thomas',
        timestamp: '31 Jul 2026, 08:15',
        actor: 'Lagos State Drainage',
      },
    ],
    govResponses: [
      {
        id: 'g1',
        agency: 'Lagos State Drainage Services',
        message:
          'Team dispatched. Estimated arrival 2 hours. Please avoid the junction if possible.',
        timestamp: '31 Jul 2026, 08:15',
      },
    ],
  },
  {
    id: 'FW-2831',
    type: 'dumping',
    status: 'received',
    severity: 'moderate',
    accessibilityImpact: 'none',
    avoidArea: false,
    title: 'Illegal dumping near canal',
    summary:
      'Household waste dumped beside drainage channel. May block water flow during heavy rain.',
    location: 'Oshodi-Apapa Expressway',
    lga: 'Apapa',
    reportedAt: '30 Jul 2026, 11:20',
    confirmations: 5,
    photoCount: 1,
    lat: 6.455,
    lng: 3.325,
    comments: [],
    timeline: [
      {
        id: 't1',
        type: 'reported',
        title: 'Report submitted',
        timestamp: '30 Jul 2026, 11:20',
      },
      {
        id: 't2',
        type: 'confirmed',
        title: '5 community confirmations',
        timestamp: '30 Jul 2026, 14:00',
      },
    ],
    govResponses: [],
  },
  {
    id: 'FW-2810',
    type: 'flooded',
    status: 'resolved',
    severity: 'high',
    accessibilityImpact: 'blocked',
    avoidArea: false,
    title: 'Flooded road on Allen Avenue',
    summary: 'Road flooding after heavy rain. Drainage cleared by response team.',
    location: 'Allen Avenue, Ikeja',
    lga: 'Ikeja',
    reportedAt: '28 Jul 2026, 08:05',
    confirmations: 15,
    photoCount: 4,
    lat: 6.6018,
    lng: 3.3515,
    comments: [],
    timeline: [
      {
        id: 't1',
        type: 'reported',
        title: 'Report submitted',
        timestamp: '28 Jul 2026, 08:05',
      },
      {
        id: 't2',
        type: 'in_progress',
        title: 'Response team on site',
        timestamp: '28 Jul 2026, 10:30',
        actor: 'Lagos State Drainage',
      },
      {
        id: 't3',
        type: 'resolved',
        title: 'Issue resolved',
        description: 'Drainage cleared, road passable',
        timestamp: '28 Jul 2026, 14:45',
        actor: 'Lagos State Drainage',
      },
    ],
    govResponses: [
      {
        id: 'g1',
        agency: 'Lagos State Drainage Services',
        message: 'Drainage cleared. Road is now passable. Thank you for reporting.',
        timestamp: '28 Jul 2026, 14:45',
      },
    ],
  },
  {
    id: 'FW-2820',
    type: 'flooded',
    status: 'received',
    severity: 'critical',
    accessibilityImpact: 'blocked',
    avoidArea: true,
    title: 'Severe flooding on Third Mainland approach',
    summary:
      'Deep water across all lanes. Vehicles stranded. Do not enter this area.',
    location: 'Third Mainland Bridge approach, Ebute Metta',
    lga: 'Mainland',
    reportedAt: '31 Jul 2026, 07:00',
    confirmations: 24,
    photoCount: 6,
    lat: 6.488,
    lng: 3.378,
    comments: [
      {
        id: 'c1',
        author: 'Citizen',
        text: 'Water above knee level. Completely impassable.',
        time: '2 hours ago',
      },
    ],
    timeline: [
      {
        id: 't1',
        type: 'reported',
        title: 'Report submitted',
        timestamp: '31 Jul 2026, 07:00',
      },
      {
        id: 't2',
        type: 'confirmed',
        title: '24 community confirmations',
        timestamp: '31 Jul 2026, 07:45',
      },
    ],
    govResponses: [],
  },
]

export const dashboardStats = {
  total: 1247,
  active: 89,
  resolved: 1058,
  byCategory: [
    { type: 'flooded' as IssueType, count: 561, pct: 45 },
    { type: 'blocked' as IssueType, count: 436, pct: 35 },
    { type: 'dumping' as IssueType, count: 250, pct: 20 },
  ],
}
