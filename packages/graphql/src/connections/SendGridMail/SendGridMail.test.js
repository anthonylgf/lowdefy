/*
  Copyright 2020 Lowdefy, Inc

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

import SendGridMail from './SendGridMail';
import testSchema from '../../test/testSchema';
import { ConfigurationError } from '../../context/errors';

const { schema } = SendGridMail;

test('All requests are present', () => {
  expect(SendGridMail.requests.SendGridMailSend).toBeDefined();
});

test('valid connection schema', () => {
  let connection = {
    apiKey: 'API_KEY',
    from: 'someone@example.com',
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
  connection = {
    apiKey: 'API_KEY',
    from: 'Some One <someone@example.com>',
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
  connection = {
    apiKey: 'API_KEY',
    from: {
      name: 'Some One',
      email: 'someone@example.com',
    },
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
});

test('valid connection schema, all email variations', () => {
  let connection = {
    apiKey: 'API_KEY',
    from: 'someone@example.com',
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
  connection = {
    apiKey: 'API_KEY',
    from: 'Some One <someone@example.com>',
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
  connection = {
    apiKey: 'API_KEY',
    from: {
      name: 'Some One',
      email: 'someone@example.com',
    },
  };
  connection = {
    apiKey: 'API_KEY',
    from: ['someone@example.com', 'someoneelse@example.com'],
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
  connection = {
    apiKey: 'API_KEY',
    from: ['Some One <someone@example.com>', 'Some One Else <someoneelse@example.com>'],
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
  connection = {
    apiKey: 'API_KEY',
    from: [
      {
        name: 'Some One',
        email: 'someone@example.com',
      },
      {
        name: 'Some One Else',
        email: 'someoneelse@example.com',
      },
    ],
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
});

test('valid connection schema, all properties', () => {
  const connection = {
    apiKey: 'API_KEY',
    from: {
      name: 'Some One',
      email: 'someone@example.com',
    },
    templateId: 'templateId',
    mailSettings: {
      sandboxMode: {
        enable: true,
      },
    },
  };
  expect(testSchema({ schema, object: connection })).toBe(true);
});

test('property apiKey is missing', () => {
  const connection = {
    from: 'someone@example.com',
  };
  expect(() => testSchema({ schema, object: connection })).toThrow(ConfigurationError);
  expect(() => testSchema({ schema, object: connection })).toThrow(
    'SendGridMail connection should have required property "apiKey".'
  );
});

test('property apiKey is not a string', () => {
  const connection = {
    apiKey: true,
    from: 'someone@example.com',
  };
  expect(() => testSchema({ schema, object: connection })).toThrow(ConfigurationError);
  expect(() => testSchema({ schema, object: connection })).toThrow(
    'SendGridMail connection property "apiKey" should be a string.'
  );
});

test('property from is missing', () => {
  const connection = {
    apiKey: 'API_KEY',
  };
  expect(() => testSchema({ schema, object: connection })).toThrow(ConfigurationError);
  expect(() => testSchema({ schema, object: connection })).toThrow(
    'SendGridMail connection should have required property "from".'
  );
});

test.only('property from is not a string', () => {
  const connection = {
    apiKey: 'API_KEY',
    from: true,
  };
  // expect(() => testSchema({ schema, object: connection })).toThrow(ConfigurationError);
  expect(() => testSchema({ schema, object: connection })).toThrow(
    'SendGridMail connection property "/from" should be an email address, or a list of email addresses.'
  );
});
