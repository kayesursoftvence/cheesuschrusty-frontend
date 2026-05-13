// ========================
// Shared Enums & Common
// ========================

export enum IntegrationProvider {
  OPENAI = "openai",
  GROK = "grok",
  LEMONSQUEEZY = "lemonsqueezy",
  CLOUDINARY = "cloudinary",
  OPENROUTER = "openrouter",
  MAILJET = "mailjet",
  GOOGLE_TRANSLATION = "google_translation",
  AZURE_EU = "azure_eu",
  NEON_DB = "neon_db",
  GEMINI = "gemini",
  STRIPE = "stripe",
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

// ========================
// GET /integration-management/credentials
// ========================

export interface IntegrationCredential {
  provider: IntegrationProvider;
  configured: boolean;
  isActive: boolean;
  fieldNames: string[];
  maskedCredentials: Record<string, string>;
  lastRotatedAt: string | null;
  updatedAt: string | null;
}

export type GetCredentialsResponse = ApiResponse<IntegrationCredential[]>;

// ========================
// PUT /integration-management/credentials/{provider}
// ========================

export interface UpdateCredentialRequest {
  credentials: Record<string, string>;
}

export type UpdateCredentialResponse = ApiResponse<IntegrationCredential>;

// ========================
// POST /integration-management/usage
// ========================

export interface PostUsageRequest {
  provider: IntegrationProvider;
  operation: string;
  requestCount: number;
  inputUnits: number;
  outputUnits: number;
  totalUnits: number;
  costUsd: number;
  metadata?: Record<string, string>;
  recordedAt: string;
}

export type PostUsageResponse = ApiResponse<null>;

// ========================
// GET /integration-management/usage
// GET /integration-management/usage-summary
// (Shared types — both endpoints return same shape)
// ========================

export interface UsageQueryParams {
  from?: string;
  to?: string;
  provider?: IntegrationProvider;
}

export interface UsageTotals {
  totalRequests: number;
  totalCostUsd: number;
  totalInputUnits: number;
  totalOutputUnits: number;
  totalUnits: number;
}

export interface UsageBreakdownItem {
  provider: IntegrationProvider;
  requestCount: number;
  totalCostUsd: number;
  totalInputUnits: number;
  totalOutputUnits: number;
  totalUnits: number;
}

export interface UsageData {
  filters: {
    provider?: IntegrationProvider;
    from?: string;
    to?: string;
  };
  totals: UsageTotals;
  breakdown: UsageBreakdownItem[];
  recordCount: number;
}

export type GetUsageResponse = ApiResponse<UsageData>;
export type GetUsageSummaryResponse = ApiResponse<UsageData>;

// ========================
// POST /integration-management/credentials/{provider}/reveal
// ========================

export interface RevealCredentialRequest {
  password: string;
}

export type RevealCredentialResponse = ApiResponse<Record<string, string>>;
