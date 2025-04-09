export function idGenerator(length: number): string {
  let res = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charsLength = chars.length;
  for (let i = 0; i <= length; i++) {
    res += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return res;
}
