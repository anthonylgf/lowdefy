/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import testContext from '../testContext';

const gqlError = new Error('gqlError');

gqlError.graphQLErrors = [
  {
    extensions: {
      displayTitle: 'displayTitle',
      displayMessage: 'displayMessage',
    },
  },
];

// Mock apollo client
const mockReqResponses = {
  req_one: {
    data: {
      request: {
        id: 'req_one',
        success: true,
        response: 1,
      },
    },
  },
  req_two: {
    data: {
      request: {
        id: 'req_two',
        success: true,
        response: 2,
      },
    },
  },
  req_error: new Error('Request error'),
  req_gql_error: gqlError,
};

const mockQuery = jest.fn();
const mockQueryImp = ({ variables }) => {
  const { input } = variables;
  const { requestId } = input;
  return new Promise((resolve, reject) => {
    if (requestId.includes('error')) {
      reject(mockReqResponses[requestId]);
    }
    resolve(mockReqResponses[requestId]);
  });
};

const client = {
  query: mockQuery,
};
const pageId = 'one';
const rootContext = {
  client,
};

const RealDate = Date;
const mockDate = jest.fn(() => ({ date: 0 }));
mockDate.now = jest.fn(() => 0);

beforeAll(() => {
  global.Date = mockDate;
});

afterAll(() => {
  global.Date = RealDate;
});

beforeEach(() => {
  mockQuery.mockReset();
  mockQuery.mockImplementation(mockQueryImp);
});

test('Request call one request', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    requests: [
      {
        requestId: 'req_one',
      },
    ],
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'Request', params: 'req_one' }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
  });
  const { button } = context.RootBlocks.map;
  const promise = button.triggerEvent({ name: 'onClick' });
  expect(context.requests.req_one).toEqual({
    error: [],
    loading: true,
    response: null,
  });
  await promise;
  expect(context.requests.req_one).toEqual({
    error: [null],
    loading: false,
    response: 1,
  });
});

test('Request call all requests', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    requests: [
      {
        requestId: 'req_one',
      },
      {
        requestId: 'req_two',
      },
    ],
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'Request', params: { all: true } }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
  });
  const { button } = context.RootBlocks.map;
  const promise = button.triggerEvent({ name: 'onClick' });
  expect(context.requests).toEqual({
    req_one: {
      error: [],
      loading: true,
      response: null,
    },
    req_two: {
      error: [],
      loading: true,
      response: null,
    },
  });
  await promise;
  expect(context.requests).toEqual({
    req_one: {
      error: [null],
      loading: false,
      response: 1,
    },
    req_two: {
      error: [null],
      loading: false,
      response: 2,
    },
  });
});

test('Request call array of requests', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    requests: [
      {
        requestId: 'req_one',
      },
      {
        requestId: 'req_two',
      },
    ],
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'Request', params: ['req_one', 'req_two'] }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
  });
  const { button } = context.RootBlocks.map;
  const promise = button.triggerEvent({ name: 'onClick' });
  expect(context.requests).toEqual({
    req_one: {
      error: [],
      loading: true,
      response: null,
    },
    req_two: {
      error: [],
      loading: true,
      response: null,
    },
  });
  await promise;
  expect(context.requests).toEqual({
    req_one: {
      error: [null],
      loading: false,
      response: 1,
    },
    req_two: {
      error: [null],
      loading: false,
      response: 2,
    },
  });
});

test('Request pass if params are none', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    requests: [
      {
        requestId: 'req_one',
      },
      {
        requestId: 'req_two',
      },
    ],
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'Request' }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
  });
  const { button } = context.RootBlocks.map;
  await button.triggerEvent({ name: 'onClick' });
  expect(context.requests).toEqual({});
});

test('Request call request error', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    requests: [
      {
        requestId: 'req_error',
      },
    ],
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'Request', params: 'req_error' }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
  });
  const { button } = context.RootBlocks.map;
  const res = await button.triggerEvent({ name: 'onClick' });

  expect(context.requests.req_error).toEqual({
    error: [new Error('Request error')],
    loading: false,
    response: null,
  });
  expect(res).toEqual({
    blockId: 'button',
    event: undefined,
    eventName: 'onClick',
    responses: [
      {
        actionId: 'a',
        actionType: 'Request',
        error: new Error('Request error'),
      },
    ],
    success: false,
    timestamp: { date: 0 },
  });
});

test('Request call request graphql error', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    requests: [
      {
        requestId: 'req_gql_error',
      },
    ],
    areas: {
      content: {
        blocks: [
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
              valueType: 'string',
            },
            events: {
              onClick: [{ id: 'a', type: 'Request', params: 'req_gql_error' }],
            },
          },
        ],
      },
    },
  };
  const context = testContext({
    rootContext,
    rootBlock,
    pageId,
  });
  const { button } = context.RootBlocks.map;
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(context.requests.req_gql_error).toEqual({
    error: [new Error('gqlError')],
    loading: false,
    response: null,
  });
  expect(res).toEqual({
    blockId: 'button',
    event: undefined,
    eventName: 'onClick',
    responses: [
      {
        actionId: 'a',
        actionType: 'Request',
        error: new Error('displayTitle: displayMessage'),
      },
    ],
    success: false,
    timestamp: { date: 0 },
  });
});
