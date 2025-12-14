import { type Address } from 'viem';

export const MUSDC_ADDRESS = process.env.NEXT_PUBLIC_MUSDC_ADDRESS as Address;
export const MUSDT_ADDRESS = process.env.NEXT_PUBLIC_MUSDT_ADDRESS as Address;
export const QUSD_ADDRESS = process.env.NEXT_PUBLIC_QUSD_ADDRESS as Address;
export const X402_TEST_URL = process.env.NEXT_PUBLIC_X402_TEST_URL as string;

// Token decimals (standard stablecoin)
export const TOKEN_DECIMALS = 6;
