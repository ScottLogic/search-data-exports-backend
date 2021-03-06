import { Client } from 'elasticsearch';

class ESCreate {
  constructor(ESConnectOptions = {}) {
    this._connectionOptions = ESConnectOptions;
    this._client = new Client(ESConnectOptions);
  }

  async create(index, type, body) {
    return this._client.index({
      index,
      type,
      body
    });
  }

  /* Take the inputted body, convert it into an actual save */
  static buildBody(type, body) {
    switch (type) {
      case 'post':
        return ESCreate.buildPostBody(body);
      default:
        return {};
    }
  }

  static buildPostBody(body) {
    const currentDate = new Date(Date.now());
    return {
      UserID: body.UserID,
      Content: body.Post,
      DateCreated: currentDate.toISOString(),
      Tags: body.Tags
    };
  }
}

export default ESCreate;
