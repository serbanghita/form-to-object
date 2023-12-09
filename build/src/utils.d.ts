import { IFormToObjectOptions } from "./types";
/**
 * Check for last numeric key.
 */
export declare function checkForLastNumericKey(o: object): string | undefined;
/**
 * Get last numeric key from an object.
 * @param o object
 * @return int
 */
export declare function getLastIntegerKey(o: object): number;
/**
 * Get the next numeric key (like the index from a PHP array)
 * @param o object
 * @return int
 */
export declare function getNextIntegerKey(o: object): number;
/**
 * Get the real number of properties from an object.
 *
 * @param {object} o
 * @returns {number}
 */
export declare function getObjLength(o: object): number;
/**
 * Simple extend of own properties.
 * Needed for our settings.
 *
 * @param {IFormToObjectOptions} settings
 * @param  {IFormToObjectOptions} source The object with new properties that we want to add the destination.
 * @return {IFormToObjectOptions}
 */
export declare function extend(settings: IFormToObjectOptions, source: IFormToObjectOptions): IFormToObjectOptions;
export declare function forEach<T extends Element>(arr: HTMLCollectionOf<T>, callback: (element: T, index?: number) => void): void;
