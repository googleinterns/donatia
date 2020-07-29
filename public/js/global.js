/**
 * Formats a raw phone number into a +# (###) ### - #### format.
 * @param {number} number The phone number unformatted.
 * @return {string} The formatted phone number.
 */
export function formatPhoneNumber(number) {
  const regexMatch = number.toString().match(/^(\d{3})(\d{3})(\d{4})$/);
  if (regexMatch) {
    return `(${regexMatch[1]}) ${regexMatch[2]}-${regexMatch[3]}`;
  }
  return number;
}
