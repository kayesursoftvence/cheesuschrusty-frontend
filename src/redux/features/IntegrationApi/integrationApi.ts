import { baseApi } from "@/redux/hooks/baseApi";
import type { ApiResponse, GetCredentialsResponse, UpdateCredentialRequest, UpdateCredentialResponse, PostUsageRequest, PostUsageResponse, GetUsageResponse, GetUsageSummaryResponse, UsageQueryParams, RevealCredentialRequest, RevealCredentialResponse } from "./integration.types";
import { IntegrationProvider } from "./integration.types";

export const integrationManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: /integration-management/credentials
    getCredentials: builder.query<GetCredentialsResponse, void>({
      query: () => ({
        url: "/integration-management/credentials",
        method: "GET",
      }),
      providesTags: ["IntegrationCredentials"],
    }),

    // PUT: /integration-management/credentials/{provider}
    updateCredential: builder.mutation<UpdateCredentialResponse, { provider: IntegrationProvider; body: UpdateCredentialRequest }>({
      query: ({ provider, body }) => ({
        url: `/integration-management/credentials/${provider}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["IntegrationCredentials"],
    }),

    // POST: /integration-management/credentials/{provider}/reveal
    revealCredential: builder.mutation<RevealCredentialResponse, { provider: IntegrationProvider; body: RevealCredentialRequest }>({
      query: ({ provider, body }) => ({
        url: `/integration-management/credentials/${provider}/reveal`,
        method: "POST",
        body,
      }),
    }),

    // POST: /integration-management/usage
    postUsage: builder.mutation<PostUsageResponse, PostUsageRequest>({
      query: (body) => ({
        url: "/integration-management/usage",
        method: "POST",
        body,
      }),
      invalidatesTags: ["IntegrationUsage", "IntegrationUsageSummary"],
    }),

    // GET: /integration-management/usage
    getUsage: builder.query<GetUsageResponse, UsageQueryParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/integration-management/usage",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["IntegrationUsage"],
    }),

    // GET: /integration-management/usage-summary
    getUsageSummary: builder.query<GetUsageSummaryResponse, UsageQueryParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/integration-management/usage-summary",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["IntegrationUsageSummary"],
    }),
    // PATCH: /integration-management/credentials/{provider}/status
    updateStatus: builder.mutation<UpdateCredentialResponse, { provider: IntegrationProvider; isActive: boolean }>({
      query: ({ provider, isActive }) => ({
        url: `/integration-management/credentials/${provider}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["IntegrationCredentials"],
    }),

    // POST: /integration-management/credentials/{provider}/test
    testConnection: builder.mutation<ApiResponse<any>, IntegrationProvider>({
      query: (provider) => ({
        url: `/integration-management/credentials/${provider}/test`,
        method: "POST",
      }),
    }),

    // POST: /integration-management/credentials/{provider}/sync
    syncIntegration: builder.mutation<ApiResponse<null>, IntegrationProvider>({
      query: (provider) => ({
        url: `/integration-management/credentials/${provider}/sync`,
        method: "POST",
      }),
      invalidatesTags: ["IntegrationUsage", "IntegrationUsageSummary"],
    }),
  }),
});

export const {
  useGetCredentialsQuery,
  useUpdateCredentialMutation,
  usePostUsageMutation,
  useGetUsageQuery,
  useGetUsageSummaryQuery,
  useUpdateStatusMutation,
  useTestConnectionMutation,
  useSyncIntegrationMutation,
  useRevealCredentialMutation,
} = integrationManagementApi;