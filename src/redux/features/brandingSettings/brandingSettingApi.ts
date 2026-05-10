 

import { baseApi } from "@/redux/hooks/baseApi";
import type {
  BrandingSettingsResponse,
 } from "./brandingSettings.types";

export const brandingSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET: /settings/branding
    getBrandingSettings: builder.query<BrandingSettingsResponse, void>({
      query: () => ({
        url: "/settings/branding",
        method: "GET",
      }),
      providesTags: ["BrandingSettings"],
    }),
 
    // }),

updateBrandingSettings: builder.mutation<
  BrandingSettingsResponse,
  FormData
>({
  query: (formData) => ({
    url: "/settings/branding",
    method: "PATCH",
    body: formData,
  }),
  invalidatesTags: ["BrandingSettings"],
}),





  }),
});

export const {
  useGetBrandingSettingsQuery,
  useUpdateBrandingSettingsMutation,
} = brandingSettingsApi;
