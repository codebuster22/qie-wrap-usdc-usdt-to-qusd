import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { qieMainnet } from './chains';

export const config = createConfig({
  chains: [qieMainnet],
  connectors: [injected()],
  transports: {
    [qieMainnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
