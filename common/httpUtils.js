export const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  getHTTPResponse() {
    const { message, statusCode } = this;
    const body = JSON.stringify({ message });
    return {
      statusCode,
      headers,
      body
    };
  }
}

export function validateRequestHeaders(event) {
  if (!event.headers || !event.headers['Content-Type'] || !event.headers['Content-Type']) {
    throw HttpError(415, 'Request header "Content-Type" must be set to "application/json"');
  }
}
