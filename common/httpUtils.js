const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export function generateSuccessResponse(body) {
  let response = {
    statusCode: 200,
    headers
  };
  if (body) response = { ...response, body: JSON.stringify(body) };
  return response;
}

function generateErrorResponse(statusCode, message) {
  return {
    statusCode,
    headers,
    body: JSON.stringify({ message })
  };
}

export function generateInternalServerErrorResponse(error) {
  return generateErrorResponse(500, error);
}

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  getHTTPResponse() {
    return generateErrorResponse(this.statusCode, this.message);
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
