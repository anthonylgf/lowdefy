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
import 'jest-canvas-mock';
import { runMockRenderTests } from '@lowdefy/block-dev';

import Block from './ChromeColorSelector.js';
import examples from './examples.yaml';
import schema from './schema.json';

const testConfig = {
  validation: true,
  required: true,
  values: [],
};

jest.mock('react-color', () => {
  const selectors = {
    ChromePicker: jest.fn(() => 'mocked'),
  };
  return selectors;
});

const mocks = [
  {
    getMockFns: async () => {
      const antd = await import('react-color');
      return [antd.ChromePicker];
    },
    getBlock: async () => {
      const Block = await import('./ChromeColorSelector.js');
      return Block.default;
    },
    name: 'ChromeColorSelector',
  },
];

runMockRenderTests({ Block, examples, mocks, schema, testConfig });