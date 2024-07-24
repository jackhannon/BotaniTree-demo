export function isJsonString<T>(str: T) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

