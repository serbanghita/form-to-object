import {IFormToObjectOptions} from "./types";

/**
 * Check for last numeric key.
 */
export function checkForLastNumericKey(o: object): string | undefined {
  if (!o || typeof o !== 'object') {
    return;
  }

  return Object.keys(o).filter(function (elem) {
    return !isNaN(parseInt(elem, 10));
  }).splice(-1)[0];
}

/**
 * Get last numeric key from an object.
 * @param o object
 * @return int
 */
export function getLastIntegerKey(o: object) {
  const lastKeyIndex = checkForLastNumericKey(o);
  if (typeof lastKeyIndex === 'string') {
    return parseInt(lastKeyIndex, 10);
  } else {
    return 0;
  }
}

/**
 * Get the next numeric key (like the index from a PHP array)
 * @param o object
 * @return int
 */
export function getNextIntegerKey(o: object): number {
  const lastKeyIndex = checkForLastNumericKey(o);
  if (typeof lastKeyIndex === 'string') {
    return parseInt(lastKeyIndex, 10) + 1;
  } else {
    return 0;
  }
}

/**
 * Get the real number of properties from an object.
 *
 * @param {object} o
 * @returns {number}
 */
export function getObjLength(o: object): number {

  if (typeof o !== 'object' || o === null) {
    return 0;
  }

  let l = 0;
  let k;

  if (typeof Object.keys === 'function') {
    l = Object.keys(o).length;
  } else {
    for (k in o) {
      if (Object.prototype.hasOwnProperty.call(o, k)) {
        l++;
      }
    }
  }

  return l;
}

/**
 * Simple extend of own properties.
 * Needed for our settings.
 *
 * @param {IFormToObjectOptions} settings
 * @param  {IFormToObjectOptions} source The object with new properties that we want to add the destination.
 * @return {IFormToObjectOptions}
 */
export function extend(settings: IFormToObjectOptions, source: IFormToObjectOptions): IFormToObjectOptions {
  let i: string;
  for (i in source) {
    if (Object.prototype.hasOwnProperty.call(source, i)) {
      settings[i] = source[i];
    }
  }
  return settings;
}

// Iteration through collections. Compatible with IE.
export function forEach<T extends Element>(arr: HTMLCollectionOf<T>, callback: (element: T, index?: number) => void) {
  return Array.prototype.forEach.call(arr, callback);
}
