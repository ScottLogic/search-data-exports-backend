import { Config, EnvironmentCredentials } from 'aws-sdk';
import ConnectionClass from 'http-aws-es';
import {
  HttpError,
  generateInternalServerErrorResponse
} from '../common/httpUtils';
import ESCreate from '../common/ESCreate';

export async function handler(event) {
  try {
    const post = { ...event };

    const ESConnectOptions = {
      host: process.env.ES_SEARCH_API ? process.env.ES_SEARCH_API : 'http://localhost:9200',
      connectionClass: ConnectionClass,
      awsConfig: new Config({
        credentials: new EnvironmentCredentials('AWS')
      })
    };
    const create = new ESCreate(ESConnectOptions);

    const body = ESCreate.buildBody('post', post);

    await create.create('posts', 'post', body);

    return body;
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) return error.getHTTPResponse();
    return generateInternalServerErrorResponse(error);
  }
}
