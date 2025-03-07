/*
  Copyright 2020-2022 Lowdefy, Inc

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

import validateApp from './validateApp.js';
import testContext from '../test/testContext.js';

const context = testContext();

test('validateApp no app defined', () => {
  const components = {};
  const result = validateApp({ components, context });
  expect(result).toEqual({
    app: {
      html: {
        appendBody: '',
        appendHead: '',
      },
    },
  });
});

test('validateApp empty app object', () => {
  const components = { app: {} };
  const result = validateApp({ components, context });
  expect(result).toEqual({
    app: {
      html: {
        appendBody: '',
        appendHead: '',
      },
    },
  });
});

test('validateApp empty html', () => {
  const components = { app: { html: {} } };
  const result = validateApp({ components, context });
  expect(result).toEqual({
    app: {
      html: {
        appendBody: '',
        appendHead: '',
      },
    },
  });
});

test('validateApp appendHead and appendHead', () => {
  const components = {
    app: {
      html: {
        appendBody: 'body',
        appendHead: 'head',
      },
    },
  };
  const result = validateApp({ components, context });
  expect(result).toEqual({
    app: {
      html: {
        appendBody: 'body',
        appendHead: 'head',
      },
    },
  });
});

test('validateApp app not an object', () => {
  const components = {
    app: 'app',
  };
  expect(() => validateApp({ components, context })).toThrow('lowdefy.app is not an object.');
});
