export interface StructuredLegalResult {
  summarizedBrief: string; // New: AI-summarized version of the complaint
  procedure: string[]; // e.g., ["Gather evidence", "Contact police", "File FIR"]
  bnsBnssCode: string; // e.g., "Section 15 BNS 2023"
  oldIpcCrpcSection: string; // e.g., "(Formerly Section 498A IPC)"
  legalGuidance: string; // The comprehensive explanation, might still be markdown
}

export interface Message {
  role: 'user' | 'model';
  content: string | StructuredLegalResult; // Allow StructuredLegalResult as content
}

export interface ComplaintDetails {
  complaintBrief: string;
  category: string; // 'Personal' or 'For Others'
}