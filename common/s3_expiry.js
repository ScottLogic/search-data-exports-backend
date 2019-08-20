function getTimeoutHours() {
  return (process.env.S3_OBJECT_TIMEOUT || 1);
}

export function fileTimeout() {
  const expireDate = new Date(Date.now());
  expireDate.setHours(expireDate.getHours() + getTimeoutHours());
  return expireDate;
}

export function signedUrlTimeout() {
  return getTimeoutHours() * 60 * 60;
}
