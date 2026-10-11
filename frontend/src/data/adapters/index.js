import { Capacitor } from "@capacitor/core";

import * as httpAdapter from "./httpAdapter";

/**
 * The only platform check in the codebase.
 *
 * Web talks to Django; Android reads and writes device SQLite. Both adapters
 * return the exact same shapes the Django views return, so nothing above this
 * module knows which one is in use.
 *
 * The SQLite adapter is loaded through a dynamic import so its plugin (and the
 * jeep-sqlite/wasm web fallback it pulls in) never enters the web bundle.
 */
const isNative = Capacitor.isNativePlatform();

let nativePromise = null;

function adapter() {
  if (!isNative) return Promise.resolve(httpAdapter);
  if (!nativePromise) nativePromise = import("./sqliteAdapter");
  return nativePromise;
}

export const isNativeAdapter = isNative;

export async function getMainData() {
  return (await adapter()).getMainData();
}

export async function getTxnsRange(start, end) {
  return (await adapter()).getTxnsRange(start, end);
}

export async function addTxn(record) {
  return (await adapter()).addTxn(record);
}

export async function getRate() {
  return (await adapter()).getRate();
}
