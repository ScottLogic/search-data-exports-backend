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
  const { headers: requestHeaders } = event;
  if (requestHeaders) {
    const contentType = Object.prototype.hasOwnProperty.call(requestHeaders, 'Content-Type')
      ? requestHeaders['Content-Type']
      : requestHeaders['content-type'];
    if (contentType !== 'application/json') {
      throw new HttpError(415, 'Request header "Content-Type" must be set to "application/json"');
    }
  } else {
    throw new HttpError(415, 'Request did not contain any headers"');
  }
}
