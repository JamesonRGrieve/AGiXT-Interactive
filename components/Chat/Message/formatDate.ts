export default function formatDate(timestamp: string, short: boolean = true): string {
  // Create a date object from the timestamp
  const date = new Date(timestamp);

  // Convert the date to the server timezone
  const serverDate = new Date(
    date.toLocaleString('en-US', {
      timeZone: process.env.NEXT_PUBLIC_TZ ? process.env.NEXT_PUBLIC_TZ.replace('TZ-', '') : '',
    }),
  );

  // Calculate the time difference between the server date and the original date
  const timeDifference = date.getTime() - serverDate.getTime();

  // Create a new date object that represents the local time
  const localDate = new Date(date.getTime() + timeDifference);

  // Format the local date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: short ? 'short' : 'long',
    day: '2-digit',
    hour: short ? 'numeric' : '2-digit',
    minute: '2-digit',
    second: short ? undefined : '2-digit',
    hour12: true,
  };
  return localDate.toLocaleString('en-US', options);
}
