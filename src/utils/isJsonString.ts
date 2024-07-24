export function isJsonString(str: unknown) {
  try {
      if (typeof str !== "string") {
        throw new TypeError
      }
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

