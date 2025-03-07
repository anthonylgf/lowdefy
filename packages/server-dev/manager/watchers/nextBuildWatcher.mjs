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

import crypto from 'crypto';
import path from 'path';
import { readFile } from '@lowdefy/node-utils';
import setupWatcher from '../utils/setupWatcher.mjs';

const hashes = {};

const watchedFiles = [
  'build/app.json',
  'build/auth.json',
  'build/config.json',
  'build/plugins/actions.js',
  'build/plugins/auth/adapters.js',
  'build/plugins/auth/callbacks.js',
  'build/plugins/auth/events.js',
  'build/plugins/auth/providers.js',
  'build/plugins/blocks.js',
  'build/plugins/connections.js',
  'build/plugins/icons.js',
  'build/plugins/operators/client.js',
  'build/plugins/operators/server.js',
  'build/plugins/styles.less',
  'package.json',
];

async function sha1(filePath) {
  const content = await readFile(filePath);
  return crypto
    .createHash('sha1')
    .update(content || '')
    .digest('hex');
}

async function nextBuildWatcher(context) {
  // Initialize hashes so that app does not rebuild the first time
  // Lowdefy build is run.
  await Promise.all(
    watchedFiles.map(async (filePath) => {
      const fullPath = path.resolve(context.directories.server, filePath);
      hashes[fullPath] = await sha1(fullPath);
    })
  );

  const callback = async (filePaths) => {
    let install = false;
    let build = false;
    await Promise.all(
      filePaths.flat().map(async (filePath) => {
        const hash = await sha1(filePath);
        if (hashes[filePath] === hash) {
          return;
        }
        build = true;
        if (filePath.endsWith('package.json')) {
          install = true;
        }
        hashes[filePath] = hash;
      })
    );

    if (!build) {
      context.logger.info({ print: 'succeed' }, 'Reloaded app.');
      return;
    }

    context.shutdownServer();
    if (install) {
      await context.installPlugins();
    }
    await context.nextBuild();
    context.restartServer();
  };

  return setupWatcher({
    callback,
    context,
    watchDotfiles: true,
    watchPaths: watchedFiles.map((filePath) => path.join(context.directories.server, filePath)),
  });
}

export default nextBuildWatcher;
