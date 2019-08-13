const AWS = require('aws-sdk');

const region = process.env.AWS_DEFAULT_REGION;
const domain = process.env.ES_API_URL.substring(8);
const endpoint = new AWS.Endpoint(domain);
const index = 'digests';
const type = 'digest';

const createIndex = async () => {
  if (await indexExists()) return;

  const request = createRequest('PUT', createBody());
  makeRequest(request);
};

const indexExists = async () => {
  const request = createRequest('HEAD');
  const response = await makeRequest(request);

  return response === 200;
};

const createRequest = (requestMethod, body = null) => {
  const request = new AWS.HttpRequest(endpoint, region);
  setParameters(request, requestMethod, body);
  setHeaders(request);
  signRequest(request);
  return request;
};

const setParameters = (request, requestMethod, body = null) => {
  request.method = requestMethod;
  request.path += `${index}/`;
  if (body) request.body = JSON.stringify(body);
};

const setHeaders = (request) => {
  request.headers['host'] = domain;
  request.headers['Content-Type'] = 'application/json';
  request.headers['Content-Length'] = request.body.length;
};

const signRequest = (request) => {
  const credentials = new AWS.EnvironmentCredentials('AWS');
  const signer = new AWS.Signers.V4(request, 'es');
  signer.addAuthorization(credentials, new Date());
};

const makeRequest = (request) => {
  const client = new AWS.HttpClient();
  return new Promise((resolve, reject) => {
    client.handleRequest(request, null, (response) => {
      response.on('data', () => {});
      response.on('end', () => reject(response.statusCode));
    }, (error) => reject(error));
  });
};

const createBody = () => ({
  mappings: {
    [type]: {
      properties: {
        search: {
          properties: {
            query: { type: 'percolator' },
            userID: { type: 'text' }
          }
        },
        Content: { type: 'text' },
        Tags: { type: 'text' }
      }
    }
  }
});

createIndex().catch((error) => {
  console.error(error);
  process.exitCode(1);
});
