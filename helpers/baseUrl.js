export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://mystore.vercel.app'
    : 'http://localhost:3000';
