import "react-native-url-polyfill/auto";
import { ReadableStream as PolyfillReadableStream } from "web-streams-polyfill";

(globalThis as any).ReadableStream = PolyfillReadableStream;

import * as Crypto from "expo-crypto";

// Polyfill crypto.getRandomValues using expo-crypto
if (typeof globalThis.crypto === "undefined") {
  (globalThis as any).crypto = {};
}

if (!globalThis.crypto.getRandomValues) {
  (globalThis.crypto as any).getRandomValues = Crypto.getRandomValues;
}

(global as any).getRandomValues = Crypto.getRandomValues;

// @ts-ignore
export * from "@ethersproject/shims";
export * from "ethers";