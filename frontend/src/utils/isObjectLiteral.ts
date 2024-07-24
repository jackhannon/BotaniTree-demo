
export function isObjectLiteral<T>(value:T ) {
  return value !== null && typeof value === 'object' && value?.constructor === Object;
}