export default function generateId(text: string): string {
  return text ? text.toLowerCase().replace(/\W+/g, '-') : '';
}
