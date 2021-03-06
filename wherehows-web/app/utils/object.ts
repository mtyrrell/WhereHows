import { arrayReduce } from 'wherehows-web/utils/array';

/**
 * Aliases the exclusion / diff conditional type that specifies that an object
 * contains properties from T, that are not in K
 * From T pick a set of properties that are not in K
 * @alias
 */
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * Aliases a record with properties of type keyof T and null values
 * Make all values in T null
 * @template T type to nullify
 * @alias
 */
type Nullify<T> = Record<keyof T, null>;

/**
 * Checks if a type is an object
 * @param {any} candidate the entity to check
 */
const isObject = (candidate: any): candidate is object =>
  candidate && Object.prototype.toString.call(candidate) === '[object Object]';

/**
 * Checks that an object has it own enumerable props
 * @param {any} object the object to the be tested
 * @return {boolean} true if enumerable keys are present
 */
const hasEnumerableKeys = (object: any): boolean => isObject(object) && !!Object.keys(object).length;

/**
 * Non mutative object attribute deletion. Removes the specified keys from a copy of the object and returns the copy.
 * @template T the object type to drop keys from
 * @template K the keys to be dropped from the object
 * @param {T} o
 * @param {Array<K extends keyof T>} droppedKeys
 * @return {Pick<T, Exclude<keyof T, K extends keyof T>>}
 */
const omit = <T, K extends keyof T>(o: T, droppedKeys: Array<K>): Omit<T, K> => {
  const partialResult = Object.assign({}, o);

  return arrayReduce((partial: T, key: K) => {
    delete partial[key];
    return partial;
  }, partialResult)(droppedKeys);
};

/**
 * Extracts keys from a source to a new object
 * @template T the object to select keys from
 * @param {T} o the source object
 * @param {Array<K extends keyof T>} pickedKeys
 * @return {Select<T extends object, K extends keyof T>}
 */
const pick = <T, K extends keyof T>(o: T, pickedKeys: Array<K>): Pick<T, K> =>
  arrayReduce(
    (partial: T, key: K): Pick<T, K> =>
      pickedKeys.includes(key) ? Object.assign(partial, { [key]: o[key] }) : partial,
    <T>{}
  )(pickedKeys);

/**
 * Creates an object of type T with a set of properties of type null
 * @template T the type of the source object
 * @template K union of literal types of properties
 * @param {T} o instance of T to be set to null
 * @returns {Nullify<T>}
 */
const nullify = <T, K extends keyof T>(o: T): Nullify<T> => {
  let nullObj = <Nullify<T>>{};
  return arrayReduce((nullObj, key: K) => Object.assign(nullObj, { [key]: null }), nullObj)(<Array<K>>Object.keys(o));
};

export { Omit, Nullify };

export { isObject, hasEnumerableKeys, omit, pick, nullify };
