export function fileTimeout() {
  const expireDate = new Date(Date.now());
  expireDate.setHours(expireDate.getHours() + (process.env.S3_OBJECT_TIMEOUT || 1));
  return expireDate;
}
