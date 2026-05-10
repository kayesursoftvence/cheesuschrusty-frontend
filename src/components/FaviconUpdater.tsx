import { useEffect } from 'react';
import { useGetBrandingSettingsQuery } from '@/redux/features/brandingSettings/brandingSettingApi';
import { useGetMeQuery } from '@/redux/features/auth/authApi';

export const FaviconUpdater = () => {
  const { data: userData } = useGetMeQuery({});
  const role = userData?.data?.role;

  // Check if current user is an admin or authorized staff
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPORT_MANAGER' || role === 'CONTENT_MANAGER';

  // Only call branding API if user is an admin to avoid 403 errors for regular users
  const { data: brandingData } = useGetBrandingSettingsQuery(undefined, {
    skip: !isAdmin
  });

  useEffect(() => {
    const faviconUrl = brandingData?.data?.faviconUrl;

    if (faviconUrl) {
      // Find existing favicon link or create a new one
      let link = document?.querySelector("link[rel~='icon']") as HTMLLinkElement;

      if (!link) {
        link = document?.createElement('link');
        link.rel = 'icon';
        document?.getElementsByTagName('head')[0]?.appendChild(link);
      }

      link.href = faviconUrl;
    }
  }, [brandingData?.data?.faviconUrl]);

  return null;
};
