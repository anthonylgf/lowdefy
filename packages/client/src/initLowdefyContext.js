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

import callRequest from './callRequest.js';
import createIcon from './createIcon.js';
import createAuthMethods from './auth/createAuthMethods.js';
import createLinkComponent from './createLinkComponent.js';
import setupLink from './setupLink.js';

const lowdefy = {
  _internal: {
    callRequest,
    components: {},
    updaters: {},
    displayMessage: ({ content }) => {
      console.log(content);
      return () => undefined;
    },
    link: () => undefined,
    progress: {
      state: {
        progress: 0,
      },
      dispatch: () => undefined,
    },
  },
  contexts: {},
  inputs: {},
  lowdefyGlobal: {},
};

function initLowdefyContext({ auth, Components, config, router, stage, types, window }) {
  if (stage === 'dev') {
    window.lowdefy = lowdefy;
  }
  lowdefy.basePath = router.basePath;
  lowdefy.home = config.rootConfig.home || {};
  lowdefy.lowdefyGlobal = config.rootConfig.lowdefyGlobal;
  lowdefy.menus = config.rootConfig.menus;
  lowdefy.pageId = config.pageConfig.pageId;
  lowdefy.user = auth?.session?.user ?? null;
  lowdefy._internal.globals = {
    document: window.document,
    fetch: window.fetch,
    window,
  };
  lowdefy._internal.router = router;
  lowdefy._internal.link = setupLink(lowdefy);
  lowdefy._internal.updateBlock = (blockId) =>
    lowdefy._internal.updaters[blockId] && lowdefy._internal.updaters[blockId]();
  lowdefy._internal.components.Link = createLinkComponent(lowdefy, Components.Link);
  lowdefy._internal.components.Icon = createIcon(types.icons);
  lowdefy._internal.actions = types.actions;
  lowdefy._internal.blockComponents = types.blocks;
  lowdefy._internal.operators = types.operators;

  // TODO: discuss not using object arguments
  lowdefy._internal.auth = createAuthMethods({ lowdefy, auth });

  return lowdefy;
}

export default initLowdefyContext;
