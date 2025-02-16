import { useState } from 'react';

import { createGlobalHook } from './create-global-hook';

export type IRuntimeConfig = {
  logo?: string;
  appName?: string;
  appDescription?: string;
  appKeywords?: string;
  copyrightInformation?: string;
  externalButtonText?: string;
  externalButtonURL?: string;
};

const useRuntimeConfig = (defaultConfig: IRuntimeConfig = {}) => {
  const [config, setConfig] = useState(defaultConfig);

  return config;
};

export const RuntimeConfig = createGlobalHook<IRuntimeConfig, IRuntimeConfig>(useRuntimeConfig);
