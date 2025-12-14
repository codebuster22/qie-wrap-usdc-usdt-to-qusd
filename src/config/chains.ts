import { defineChain } from 'viem';

export const qieMainnet = defineChain({
  id: 1990,
  name: 'QIEMainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'QIE',
    symbol: 'QIEV3',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc1mainnet.qie.digital/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'QIE Explorer',
      url: 'https://mainnet.qie.digital/',
    },
  },
});
