export function generateUniqueTicketNumber(): string {
    const prefix = 'LA';
    const timestamp = new Date().getTime().toString();
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return prefix + timestamp + random;
  }
  