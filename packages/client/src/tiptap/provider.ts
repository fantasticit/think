import { HocuspocusProvider } from '@hocuspocus/provider';
import { IUser } from '@think/domains';

const PROVIDER_POOL_READER = new Map();
const PROVIDER_POOL_EDITOR = new Map();

export type ProviderStatus = 'connecting' | 'connected' | 'disconnected' | 'loadCacheSuccess';

export const getProvider = ({
  targetId,
  token,
  cacheType = 'READER',
  user,
  docType = 'document',
  events = {},
}: {
  targetId: string;
  token: string;
  cacheType: 'READER' | 'EDITOR';
  user: IUser;
  docType: 'document' | 'template';
  events?: {
    onAuthenticated?: () => void;
    onAuthenticationFailed?: ({ reason }: { reason: string }) => void;
    onOpen?: (event: Event) => void;
    onConnect?: () => void;
    onMessage?: (event: MessageEvent) => void;
    onOutgoingMessage?: (message) => void;
    onStatus?: (status: any) => void;
    onSynced?: () => void;
    onDisconnect?: (event: CloseEvent) => void;
    onClose?: (event: CloseEvent) => void;
    onDestroy?: () => void;
    onAwarenessChange?: (states: any) => void;
    onAwarenessUpdate?: (states: any) => void;
  };
}) => {
  const pool = cacheType === 'READER' ? PROVIDER_POOL_READER : PROVIDER_POOL_EDITOR;

  if (!pool.has(targetId)) {
    const provider = new HocuspocusProvider({
      url: process.env.COLLABORATION_API_URL,
      name: targetId,
      token,
      parameters: {
        targetId,
        userId: user && user.id,
        docType,
      },
      maxAttempts: 5,
      ...events,
    } as any);
    pool.set(targetId, provider);
  }
  return pool.get(targetId);
};

export const destoryProvider = (provider, cacheType: 'READER' | 'EDITOR' = 'READER') => {
  const pool = cacheType === 'READER' ? PROVIDER_POOL_READER : PROVIDER_POOL_EDITOR;

  pool.delete(provider.configuration.name);
  provider.document.destroy();
  provider.destroy();
};
