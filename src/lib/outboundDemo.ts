// Demo data for the Outbound tab. Nothing here talks to the server: the page is
// a design demo, so the campaigns, leads, calls and analytics below are seeded
// in memory and every mutation stays in React state.
//
// The shapes deliberately mirror the NLPearl Outbound API
// (https://developers.nlpearl.ai/api-reference/v2/outbound) so that swapping the
// seed for real responses later is a data change, not a redesign:
//   - campaign        -> OutboundApiListView (id, name, status, totalAgents,
//                        budgetTotal, budgetConsumed, totalLeads, created)
//   - lead            -> LeadApi / LeadToAddApi (phoneNumber, externalId,
//                        timeZoneId, status, created, callData)
//   - call            -> CallApi (from, to, startTime, duration, status,
//                        conversationStatus, tags)
//   - analytics       -> AnalyticsOutboundApi (callsStatusOverview,
//                        callsSentimentOverview, callEventsCounts, timelines)
// The numeric codes each enum carries on the wire are kept alongside the labels
// so the UI can show them the way the API reference does.

/* ---------------------------------------------------------------- statuses */

// eActivityStatus
export type ActivityStatus = "running" | "paused" | "suspended" | "maintenance";

export const activityStatusCodes: Record<ActivityStatus, number> = {
  running: 1,
  paused: 2,
  suspended: 3,
  maintenance: 10,
};

export const activityStatusLabels: Record<ActivityStatus, string> = {
  running: "Running",
  paused: "Paused",
  suspended: "Suspended",
  maintenance: "Maintenance",
};

// Lead status enum from search-leads.
export type LeadStatus =
  | "new"
  | "needRetry"
  | "inCallQueue"
  | "wrongCountryCode"
  | "onCall"
  | "voiceMailLeft"
  | "success"
  | "notSuccessful"
  | "completed"
  | "unreachable"
  | "blacklisted"
  | "error";

export const leadStatusCodes: Record<LeadStatus, number> = {
  new: 1,
  needRetry: 10,
  inCallQueue: 20,
  wrongCountryCode: 30,
  onCall: 40,
  voiceMailLeft: 70,
  success: 100,
  notSuccessful: 110,
  completed: 130,
  unreachable: 150,
  blacklisted: 220,
  error: 500,
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  needRetry: "Need retry",
  inCallQueue: "In call queue",
  wrongCountryCode: "Wrong country code",
  onCall: "On call",
  voiceMailLeft: "Voicemail left",
  success: "Success",
  notSuccessful: "Not successful",
  completed: "Completed",
  unreachable: "Unreachable",
  blacklisted: "Blacklisted",
  error: "Error",
};

export const leadStatusOrder: LeadStatus[] = [
  "new",
  "inCallQueue",
  "onCall",
  "needRetry",
  "voiceMailLeft",
  "success",
  "completed",
  "notSuccessful",
  "unreachable",
  "wrongCountryCode",
  "blacklisted",
  "error",
];

// Call status enum from search-calls.
export type CallStatus = "inProgress" | "completed" | "busy" | "failed" | "noAnswer" | "canceled";

export const callStatusCodes: Record<CallStatus, number> = {
  inProgress: 3,
  completed: 4,
  busy: 5,
  failed: 6,
  noAnswer: 7,
  canceled: 8,
};

export const callStatusLabels: Record<CallStatus, string> = {
  inProgress: "In progress",
  completed: "Completed",
  busy: "Busy",
  failed: "Failed",
  noAnswer: "No answer",
  canceled: "Canceled",
};

// Conversation status enum from search-calls.
export type ConversationStatus =
  | "notAnswered"
  | "inQueue"
  | "onGoing"
  | "voiceMailLeft"
  | "success"
  | "notSuccessful"
  | "completed"
  | "unreachable"
  | "queueAbandon"
  | "error";

export const conversationStatusLabels: Record<ConversationStatus, string> = {
  notAnswered: "Not answered",
  inQueue: "In queue",
  onGoing: "Ongoing",
  voiceMailLeft: "Voicemail left",
  success: "Success",
  notSuccessful: "Not successful",
  completed: "Completed",
  unreachable: "Unreachable",
  queueAbandon: "Queue abandon",
  error: "Error",
};

/* ------------------------------------------------------------- call config */

export type RecordingOption = "pearlAndEndUser" | "pearlOnly" | "none";
export type TranscriptOption = "full" | "sensitiveRemoved" | "none";
export type RetryInterval = "3h" | "6h" | "daily" | "3d" | "weekly" | "monthly";
export type Ambience = "none" | "office" | "callCenter" | "outdoor";
export type WebhookVersion = "v1" | "v2";
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const recordingOptionLabels: Record<RecordingOption, string> = {
  pearlAndEndUser: "Agent & end-user",
  pearlOnly: "Agent only",
  none: "No recording",
};

export const transcriptOptionLabels: Record<TranscriptOption, string> = {
  full: "Full transcript",
  sensitiveRemoved: "Sensitive info removed",
  none: "No transcript",
};

export const retryIntervalLabels: Record<RetryInterval, string> = {
  "3h": "Every 3 hours",
  "6h": "Every 6 hours",
  daily: "Daily",
  "3d": "Every 3 days",
  weekly: "Weekly",
  monthly: "Monthly",
};

export const ambienceLabels: Record<Ambience, string> = {
  none: "No ambience",
  office: "Office",
  callCenter: "Call center",
  outdoor: "Outdoor",
};

export const weekdays: { key: Weekday; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

// Windows timezone identifiers, the format the Add Lead endpoint documents.
export const timeZoneIds = [
  "Pacific Standard Time",
  "Mountain Standard Time",
  "Central Standard Time",
  "Eastern Standard Time",
  "GMT Standard Time",
  "W. Europe Standard Time",
  "Central Europe Standard Time",
  "India Standard Time",
  "Bangladesh Standard Time",
  "Singapore Standard Time",
  "AUS Eastern Standard Time",
];

// Field limits the API documents, enforced by the demo forms.
export const voicemailDropLimit = 500;
export const ivrBypassLimit = 500;
export const maxRetryAttempts = 11;
export const ringDurationBounds = { min: 10, max: 50 } as const;
export const callDurationBounds = { min: 1, max: 120 } as const;

export type CampaignSettings = {
  budgetTotal: number | null;
  recordingOption: RecordingOption;
  recordingAfterTransfer: boolean;
  transcriptOption: TranscriptOption;
  defaultTimeZoneId: string;
  retryAttempts: number;
  retryInterval: RetryInterval;
  ambience: Ambience;
  ambienceVolume: number;
  ringDurationSeconds: number;
  callDurationLimitMinutes: number;
  voicemailDrop: string;
  ivrBypass: string;
  callingDays: Weekday[];
  callingStart: string;
  callingEnd: string;
  callWebhookUrl: string;
  leadWebhookUrl: string;
  webhookVersion: WebhookVersion;
};

/* ------------------------------------------------------------ data records */

export type Lead = {
  id: string;
  externalId: string;
  phoneNumber: string;
  timeZoneId: string;
  status: LeadStatus;
  created: string;
  attempts: number;
  callData: Record<string, string>;
};

export type Call = {
  id: string;
  startTime: string;
  from: string;
  to: string;
  duration: number;
  status: CallStatus;
  conversationStatus: ConversationStatus;
  tags: string[];
};

// callsStatusOverview on AnalyticsOutboundApi.
export type StatusOverview = {
  totalCalls: number;
  totalLeads: number;
  answeredCalls: number;
  successful: number;
  completed: number;
  unsuccessful: number;
  needRetry: number;
  needFollowUp: number;
  voiceMailLeft: number;
  unreachable: number;
  wrongNumber: number;
  wrongCountryCode: number;
  error: number;
};

// callsSentimentOverview — a diverging scale, ordered negative to positive.
export type SentimentOverview = {
  negative: number;
  slightlyNegative: number;
  neutral: number;
  slightlyPositive: number;
  positive: number;
};

// callEventsCounts
export type EventCounts = {
  calendarBookedCount: number;
  callTransferredCount: number;
  smsSentCount: number;
  emailSentCount: number;
  takeMessageCount: number;
};

export type DayPoint = { date: string; calls: number; cost: number };

export type Campaign = {
  id: string;
  name: string;
  goal: string;
  status: ActivityStatus;
  created: string;
  totalAgents: number;
  budgetConsumed: number;
  settings: CampaignSettings;
  overview: StatusOverview;
  sentiment: SentimentOverview;
  events: EventCounts;
  timeline: DayPoint[];
  leads: Lead[];
  calls: Call[];
};

/* -------------------------------------------------------------- chart keys */

// Outcome buckets for the stacked share bar, in a fixed order. The hues are
// assigned per bucket and never cycled; the palette was checked for
// colour-vision separation against the dashboard surface, and "Other" is the
// deliberate neutral that absorbs the long tail (wrong number, wrong country
// code, error).
export const outcomeBuckets = [
  { key: "successful", label: "Successful", color: "#34d399" },
  { key: "completed", label: "Completed", color: "#818cf8" },
  { key: "unsuccessful", label: "Not successful", color: "#fb7185" },
  { key: "needRetry", label: "Need retry", color: "#fbbf24" },
  { key: "voiceMailLeft", label: "Voicemail left", color: "#38bdf8" },
  { key: "unreachable", label: "Unreachable", color: "#fb923c" },
  { key: "other", label: "Other", color: "#6b7280" },
] as const;

export type OutcomeKey = (typeof outcomeBuckets)[number]["key"];

export function outcomeCounts(overview: StatusOverview): Record<OutcomeKey, number> {
  return {
    successful: overview.successful,
    completed: overview.completed,
    unsuccessful: overview.unsuccessful,
    needRetry: overview.needRetry,
    voiceMailLeft: overview.voiceMailLeft,
    unreachable: overview.unreachable,
    other: overview.wrongNumber + overview.wrongCountryCode + overview.error,
  };
}

// Sentiment is polarity, so it gets a diverging ramp: one hue per pole with a
// neutral grey in the middle, ordered so the bar reads negative to positive.
export const sentimentBuckets = [
  { key: "negative", label: "Negative", color: "#f43f5e" },
  { key: "slightlyNegative", label: "Slightly negative", color: "#fecdd3" },
  { key: "neutral", label: "Neutral", color: "#8b8b94" },
  { key: "slightlyPositive", label: "Slightly positive", color: "#a7f3d0" },
  { key: "positive", label: "Positive", color: "#10b981" },
] as const;

export type SentimentKey = (typeof sentimentBuckets)[number]["key"];

/* -------------------------------------------------------------- formatting */

// Fixed locale and timezone: the demo rows are rendered on the server as well as
// the client, and a locale-dependent format would not match across the two.
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
});

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function formatDay(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dayFormatter.format(date);
}

export function formatDuration(seconds: number) {
  if (seconds <= 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export function formatPercent(part: number, total: number) {
  if (total <= 0) return "—";
  return `${Math.round((part / total) * 1000) / 10}%`;
}

/* ------------------------------------------------------------------- seeds */

const defaultSettings: CampaignSettings = {
  budgetTotal: 2500,
  recordingOption: "pearlAndEndUser",
  recordingAfterTransfer: true,
  transcriptOption: "full",
  defaultTimeZoneId: "Eastern Standard Time",
  retryAttempts: 3,
  retryInterval: "6h",
  ambience: "office",
  ambienceVolume: 25,
  ringDurationSeconds: 20,
  callDurationLimitMinutes: 30,
  voicemailDrop:
    "Hi {{first_name}}, this is Ava from Voca about your solar quote. I'll try again tomorrow, or call us back any time.",
  ivrBypass: "If a menu answers, press 1 for sales, then wait for a human greeting before starting the script.",
  callingDays: ["mon", "tue", "wed", "thu", "fri"],
  callingStart: "08:00",
  callingEnd: "18:00",
  callWebhookUrl: "https://hooks.voca.ai/outbound/call",
  leadWebhookUrl: "https://hooks.voca.ai/outbound/lead",
  webhookVersion: "v2",
};

function timeline(start: string, calls: number[], costPerCall: number): DayPoint[] {
  const startMs = Date.parse(start);
  return calls.map((count, index) => ({
    date: new Date(startMs + index * 86_400_000).toISOString(),
    calls: count,
    cost: Math.round(count * costPerCall * 100) / 100,
  }));
}

export const demoCampaigns: Campaign[] = [
  {
    id: "ob_7f3a91c4",
    name: "Solar — Summer Retarget",
    goal: "Re-engage quote requests from June and book a survey slot.",
    status: "running",
    created: "2026-07-14T09:00:00Z",
    totalAgents: 6,
    budgetConsumed: 1487.4,
    settings: { ...defaultSettings },
    overview: {
      totalCalls: 656,
      totalLeads: 1240,
      answeredCalls: 412,
      successful: 188,
      completed: 141,
      unsuccessful: 96,
      needRetry: 118,
      needFollowUp: 34,
      voiceMailLeft: 84,
      unreachable: 29,
      wrongNumber: 12,
      wrongCountryCode: 7,
      error: 10,
    },
    sentiment: { negative: 41, slightlyNegative: 76, neutral: 158, slightlyPositive: 92, positive: 45 },
    events: {
      calendarBookedCount: 63,
      callTransferredCount: 27,
      smsSentCount: 145,
      emailSentCount: 38,
      takeMessageCount: 19,
    },
    timeline: timeline("2026-07-28T00:00:00Z", [38, 44, 51, 47, 62, 29, 18, 55, 61, 58, 66, 71, 34, 22], 2.27),
    leads: [
      {
        id: "ld_4a11",
        externalId: "CRM-88213",
        phoneNumber: "+14155550118",
        timeZoneId: "Pacific Standard Time",
        status: "success",
        created: "2026-08-04T14:12:00Z",
        attempts: 2,
        callData: { first_name: "Dana", quote_kw: "7.4", city: "Oakland" },
      },
      {
        id: "ld_4a12",
        externalId: "CRM-88214",
        phoneNumber: "+12125550193",
        timeZoneId: "Eastern Standard Time",
        status: "needRetry",
        created: "2026-08-04T14:12:00Z",
        attempts: 1,
        callData: { first_name: "Marcus", quote_kw: "5.1", city: "Queens" },
      },
      {
        id: "ld_4a13",
        externalId: "CRM-88221",
        phoneNumber: "+13125550142",
        timeZoneId: "Central Standard Time",
        status: "onCall",
        created: "2026-08-05T08:03:00Z",
        attempts: 3,
        callData: { first_name: "Priya", quote_kw: "9.0", city: "Chicago" },
      },
      {
        id: "ld_4a14",
        externalId: "CRM-88230",
        phoneNumber: "+16175550177",
        timeZoneId: "Eastern Standard Time",
        status: "voiceMailLeft",
        created: "2026-08-05T08:03:00Z",
        attempts: 2,
        callData: { first_name: "Tomas", quote_kw: "6.2", city: "Boston" },
      },
      {
        id: "ld_4a15",
        externalId: "CRM-88244",
        phoneNumber: "+17025550164",
        timeZoneId: "Pacific Standard Time",
        status: "inCallQueue",
        created: "2026-08-06T11:41:00Z",
        attempts: 0,
        callData: { first_name: "Riley", quote_kw: "4.8", city: "Las Vegas" },
      },
      {
        id: "ld_4a16",
        externalId: "CRM-88250",
        phoneNumber: "+14045550109",
        timeZoneId: "Eastern Standard Time",
        status: "notSuccessful",
        created: "2026-08-06T11:41:00Z",
        attempts: 4,
        callData: { first_name: "Bea", quote_kw: "8.3", city: "Atlanta" },
      },
      {
        id: "ld_4a17",
        externalId: "CRM-88266",
        phoneNumber: "+15035550188",
        timeZoneId: "Pacific Standard Time",
        status: "new",
        created: "2026-08-09T07:22:00Z",
        attempts: 0,
        callData: { first_name: "Jonah", quote_kw: "5.5", city: "Portland" },
      },
      {
        id: "ld_4a18",
        externalId: "CRM-88271",
        phoneNumber: "+447700900112",
        timeZoneId: "GMT Standard Time",
        status: "wrongCountryCode",
        created: "2026-08-09T07:22:00Z",
        attempts: 1,
        callData: { first_name: "Elise", quote_kw: "3.9", city: "Bristol" },
      },
    ],
    calls: [
      {
        id: "cl_9f01",
        startTime: "2026-08-10T13:41:00Z",
        from: "+14155550100",
        to: "+13125550142",
        duration: 214,
        status: "inProgress",
        conversationStatus: "onGoing",
        tags: ["survey_interest"],
      },
      {
        id: "cl_9f02",
        startTime: "2026-08-10T12:58:00Z",
        from: "+14155550100",
        to: "+14155550118",
        duration: 331,
        status: "completed",
        conversationStatus: "success",
        tags: ["booked", "survey_interest"],
      },
      {
        id: "cl_9f03",
        startTime: "2026-08-10T12:12:00Z",
        from: "+14155550100",
        to: "+16175550177",
        duration: 42,
        status: "completed",
        conversationStatus: "voiceMailLeft",
        tags: ["voicemail"],
      },
      {
        id: "cl_9f04",
        startTime: "2026-08-10T11:30:00Z",
        from: "+14155550100",
        to: "+14045550109",
        duration: 188,
        status: "completed",
        conversationStatus: "notSuccessful",
        tags: ["price_objection"],
      },
      {
        id: "cl_9f05",
        startTime: "2026-08-10T10:47:00Z",
        from: "+14155550100",
        to: "+12125550193",
        duration: 0,
        status: "noAnswer",
        conversationStatus: "notAnswered",
        tags: [],
      },
      {
        id: "cl_9f06",
        startTime: "2026-08-10T09:55:00Z",
        from: "+14155550100",
        to: "+17025550164",
        duration: 0,
        status: "busy",
        conversationStatus: "notAnswered",
        tags: [],
      },
      {
        id: "cl_9f07",
        startTime: "2026-08-09T16:20:00Z",
        from: "+14155550100",
        to: "+15035550188",
        duration: 276,
        status: "completed",
        conversationStatus: "completed",
        tags: ["callback_requested"],
      },
    ],
  },
  {
    id: "ob_2b8e40d7",
    name: "Dental Recall — August",
    goal: "Remind lapsed patients and fill next month's hygiene slots.",
    status: "paused",
    created: "2026-07-30T10:30:00Z",
    totalAgents: 3,
    budgetConsumed: 431.05,
    settings: {
      ...defaultSettings,
      budgetTotal: 900,
      recordingOption: "pearlOnly",
      transcriptOption: "sensitiveRemoved",
      retryAttempts: 2,
      retryInterval: "daily",
      ambience: "none",
      ambienceVolume: 0,
      ringDurationSeconds: 25,
      callDurationLimitMinutes: 12,
      voicemailDrop: "Hi {{first_name}}, it's Northside Dental. You're due for a check-up — call us back to pick a time.",
      ivrBypass: "",
      callingDays: ["mon", "tue", "wed", "thu", "fri", "sat"],
      callingStart: "09:00",
      callingEnd: "17:00",
      webhookVersion: "v1",
    },
    overview: {
      totalCalls: 306,
      totalLeads: 468,
      answeredCalls: 171,
      successful: 96,
      completed: 62,
      unsuccessful: 51,
      needRetry: 47,
      needFollowUp: 18,
      voiceMailLeft: 39,
      unreachable: 11,
      wrongNumber: 5,
      wrongCountryCode: 2,
      error: 4,
    },
    sentiment: { negative: 12, slightlyNegative: 24, neutral: 61, slightlyPositive: 48, positive: 26 },
    events: {
      calendarBookedCount: 44,
      callTransferredCount: 9,
      smsSentCount: 61,
      emailSentCount: 12,
      takeMessageCount: 7,
    },
    timeline: timeline("2026-07-28T00:00:00Z", [12, 19, 24, 21, 30, 8, 5, 26, 33, 29, 35, 41, 14, 9], 1.41),
    leads: [
      {
        id: "ld_7c01",
        externalId: "PAT-1042",
        phoneNumber: "+13055550171",
        timeZoneId: "Eastern Standard Time",
        status: "success",
        created: "2026-07-31T09:05:00Z",
        attempts: 1,
        callData: { first_name: "Nadia", last_visit: "2025-02-11" },
      },
      {
        id: "ld_7c02",
        externalId: "PAT-1043",
        phoneNumber: "+13055550172",
        timeZoneId: "Eastern Standard Time",
        status: "completed",
        created: "2026-07-31T09:05:00Z",
        attempts: 2,
        callData: { first_name: "Owen", last_visit: "2024-11-03" },
      },
      {
        id: "ld_7c03",
        externalId: "PAT-1051",
        phoneNumber: "+19045550133",
        timeZoneId: "Eastern Standard Time",
        status: "needRetry",
        created: "2026-08-01T13:20:00Z",
        attempts: 1,
        callData: { first_name: "Sasha", last_visit: "2025-06-27" },
      },
      {
        id: "ld_7c04",
        externalId: "PAT-1058",
        phoneNumber: "+18135550149",
        timeZoneId: "Eastern Standard Time",
        status: "unreachable",
        created: "2026-08-01T13:20:00Z",
        attempts: 3,
        callData: { first_name: "Gabe", last_visit: "2024-08-19" },
      },
      {
        id: "ld_7c05",
        externalId: "PAT-1066",
        phoneNumber: "+17275550120",
        timeZoneId: "Eastern Standard Time",
        status: "new",
        created: "2026-08-07T15:44:00Z",
        attempts: 0,
        callData: { first_name: "Lin", last_visit: "2025-09-02" },
      },
      {
        id: "ld_7c06",
        externalId: "PAT-1071",
        phoneNumber: "+14075550196",
        timeZoneId: "Eastern Standard Time",
        status: "blacklisted",
        created: "2026-08-07T15:44:00Z",
        attempts: 1,
        callData: { first_name: "Rae", last_visit: "2023-12-08" },
      },
    ],
    calls: [
      {
        id: "cl_3d01",
        startTime: "2026-08-08T15:02:00Z",
        from: "+13055550100",
        to: "+13055550171",
        duration: 152,
        status: "completed",
        conversationStatus: "success",
        tags: ["booked"],
      },
      {
        id: "cl_3d02",
        startTime: "2026-08-08T14:31:00Z",
        from: "+13055550100",
        to: "+19045550133",
        duration: 0,
        status: "noAnswer",
        conversationStatus: "notAnswered",
        tags: [],
      },
      {
        id: "cl_3d03",
        startTime: "2026-08-08T13:19:00Z",
        from: "+13055550100",
        to: "+13055550172",
        duration: 97,
        status: "completed",
        conversationStatus: "completed",
        tags: ["callback_requested"],
      },
      {
        id: "cl_3d04",
        startTime: "2026-08-08T11:48:00Z",
        from: "+13055550100",
        to: "+18135550149",
        duration: 0,
        status: "failed",
        conversationStatus: "unreachable",
        tags: ["carrier_reject"],
      },
      {
        id: "cl_3d05",
        startTime: "2026-08-07T16:05:00Z",
        from: "+13055550100",
        to: "+14075550196",
        duration: 61,
        status: "canceled",
        conversationStatus: "queueAbandon",
        tags: ["do_not_call"],
      },
    ],
  },
  {
    id: "ob_c05d2ae9",
    name: "Insurance Renewals — Pilot",
    goal: "Test the renewal script on 200 policies before the full rollout.",
    status: "running",
    created: "2026-08-02T08:15:00Z",
    totalAgents: 2,
    budgetConsumed: 208.6,
    settings: {
      ...defaultSettings,
      budgetTotal: null,
      recordingOption: "none",
      recordingAfterTransfer: false,
      transcriptOption: "full",
      defaultTimeZoneId: "GMT Standard Time",
      retryAttempts: 5,
      retryInterval: "3h",
      ambience: "callCenter",
      ambienceVolume: 40,
      ringDurationSeconds: 30,
      callDurationLimitMinutes: 20,
      voicemailDrop: "",
      ivrBypass: "Press 2 at the main menu, then 1 for policy services.",
      callingDays: ["mon", "tue", "wed", "thu", "fri"],
      callingStart: "10:00",
      callingEnd: "19:00",
      callWebhookUrl: "",
      leadWebhookUrl: "",
    },
    overview: {
      totalCalls: 147,
      totalLeads: 210,
      answeredCalls: 79,
      successful: 31,
      completed: 28,
      unsuccessful: 34,
      needRetry: 22,
      needFollowUp: 12,
      voiceMailLeft: 26,
      unreachable: 6,
      wrongNumber: 3,
      wrongCountryCode: 1,
      error: 2,
    },
    sentiment: { negative: 9, slightlyNegative: 14, neutral: 30, slightlyPositive: 17, positive: 9 },
    events: {
      calendarBookedCount: 11,
      callTransferredCount: 4,
      smsSentCount: 23,
      emailSentCount: 5,
      takeMessageCount: 3,
    },
    timeline: timeline("2026-07-28T00:00:00Z", [0, 0, 0, 6, 11, 9, 14, 17, 12, 20, 23, 18, 10, 7], 1.42),
    leads: [
      {
        id: "ld_9e01",
        externalId: "POL-55011",
        phoneNumber: "+447700900431",
        timeZoneId: "GMT Standard Time",
        status: "success",
        created: "2026-08-03T09:30:00Z",
        attempts: 1,
        callData: { first_name: "Harriet", policy: "Home", renewal: "2026-09-01" },
      },
      {
        id: "ld_9e02",
        externalId: "POL-55019",
        phoneNumber: "+447700900432",
        timeZoneId: "GMT Standard Time",
        status: "needRetry",
        created: "2026-08-03T09:30:00Z",
        attempts: 2,
        callData: { first_name: "Callum", policy: "Motor", renewal: "2026-08-24" },
      },
      {
        id: "ld_9e03",
        externalId: "POL-55024",
        phoneNumber: "+353871234567",
        timeZoneId: "GMT Standard Time",
        status: "inCallQueue",
        created: "2026-08-06T12:10:00Z",
        attempts: 0,
        callData: { first_name: "Aoife", policy: "Travel", renewal: "2026-09-15" },
      },
      {
        id: "ld_9e04",
        externalId: "POL-55030",
        phoneNumber: "+447700900433",
        timeZoneId: "GMT Standard Time",
        status: "error",
        created: "2026-08-06T12:10:00Z",
        attempts: 1,
        callData: { first_name: "Femi", policy: "Home", renewal: "2026-08-30" },
      },
      {
        id: "ld_9e05",
        externalId: "POL-55038",
        phoneNumber: "+447700900434",
        timeZoneId: "GMT Standard Time",
        status: "new",
        created: "2026-08-09T18:02:00Z",
        attempts: 0,
        callData: { first_name: "Suri", policy: "Motor", renewal: "2026-10-02" },
      },
    ],
    calls: [
      {
        id: "cl_6b01",
        startTime: "2026-08-10T10:22:00Z",
        from: "+442038900100",
        to: "+447700900431",
        duration: 245,
        status: "completed",
        conversationStatus: "success",
        tags: ["renewed"],
      },
      {
        id: "cl_6b02",
        startTime: "2026-08-10T09:44:00Z",
        from: "+442038900100",
        to: "+447700900432",
        duration: 0,
        status: "noAnswer",
        conversationStatus: "notAnswered",
        tags: [],
      },
      {
        id: "cl_6b03",
        startTime: "2026-08-09T17:03:00Z",
        from: "+442038900100",
        to: "+447700900433",
        duration: 12,
        status: "failed",
        conversationStatus: "error",
        tags: ["sip_486"],
      },
      {
        id: "cl_6b04",
        startTime: "2026-08-09T16:15:00Z",
        from: "+442038900100",
        to: "+353871234567",
        duration: 178,
        status: "completed",
        conversationStatus: "notSuccessful",
        tags: ["price_objection", "callback_requested"],
      },
    ],
  },
];

// A fresh campaign starts empty: no leads, no calls, nothing to chart. The demo
// still gives it the documented defaults so the settings tab has something real
// to render.
export function blankCampaign(id: string, name: string, goal: string, timeZoneId: string, budgetTotal: number | null, totalAgents: number): Campaign {
  return {
    id,
    name,
    goal,
    status: "paused",
    created: new Date().toISOString(),
    totalAgents,
    budgetConsumed: 0,
    settings: { ...defaultSettings, budgetTotal, defaultTimeZoneId: timeZoneId },
    overview: {
      totalCalls: 0,
      totalLeads: 0,
      answeredCalls: 0,
      successful: 0,
      completed: 0,
      unsuccessful: 0,
      needRetry: 0,
      needFollowUp: 0,
      voiceMailLeft: 0,
      unreachable: 0,
      wrongNumber: 0,
      wrongCountryCode: 0,
      error: 0,
    },
    sentiment: { negative: 0, slightlyNegative: 0, neutral: 0, slightlyPositive: 0, positive: 0 },
    events: {
      calendarBookedCount: 0,
      callTransferredCount: 0,
      smsSentCount: 0,
      emailSentCount: 0,
      takeMessageCount: 0,
    },
    timeline: [],
    leads: [],
    calls: [],
  };
}
