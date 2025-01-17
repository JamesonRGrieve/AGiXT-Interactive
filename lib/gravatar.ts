import md5 from 'md5';

/**
 * Generates a Gravatar URL for the given email.
 * @param email - The user's email address.
 * @param size - The size of the Gravatar image (default is 40).
 * @returns A string containing the Gravatar URL.
 */
export const getGravatarUrl = (email: string, size = 40): string => {
  if (!email) return '';
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;
};
