interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_HOTLINE?: string;
  readonly VITE_ZALO_OA_ID?: string;
  readonly VITE_ZALO_URL?: string;
  readonly VITE_FB_PAGE_USERNAME?: string;
  readonly VITE_MESSENGER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css' {}
