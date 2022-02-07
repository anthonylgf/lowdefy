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

import { type } from '@lowdefy/helpers';
import mingoAggregation from './mingoAggregation.js';

function mingoFilter({ input = [], filter = {} }) {
  if (!type.isObject(filter)) {
    throw new Error('Mingo filter error. Argument "filter" should be an object.');
  }
  if (!type.isArray(input)) {
    throw new Error('Mingo filter error. Argument "input" should be an array.');
  }
  const pipeline = [{ $match: filter }];
  return mingoAggregation({ input, pipeline });
}

export default mingoFilter;