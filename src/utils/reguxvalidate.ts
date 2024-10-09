export function validateWithRegex(input: string, regex: RegExp): boolean {
  return regex.test(input);
}
