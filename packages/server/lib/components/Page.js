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

import React from 'react';

import { urlQuery } from '@lowdefy/helpers';
import { useRouter } from 'next/router';

import Context from './Context.js';
import Head from './Head.js';
import Block from './block/Block.js';
import setupLink from '../utils/setupLink.js';
import createComponents from './createComponents.js';

const LoadingBlock = () => <div>Loading...</div>;

const Page = ({ lowdefy, pageConfig, rootConfig }) => {
  const router = useRouter();
  lowdefy._internal.router = router;
  lowdefy._internal.link = setupLink(lowdefy);
  lowdefy._internal.components = createComponents(lowdefy);

  lowdefy.basePath = lowdefy._internal.router.basePath;
  lowdefy.home = rootConfig.home;
  lowdefy.lowdefyGlobal = rootConfig.lowdefyGlobal;
  lowdefy.menus = rootConfig.menus;
  lowdefy.urlQuery = urlQuery.parse(window.location.search.slice(1));

  return (
    <Context config={pageConfig} lowdefy={lowdefy}>
      {(context, loading) => {
        if (loading) {
          return <LoadingBlock />;
        }
        return (
          <>
            <Head properties={context._internal.RootBlocks.map[pageConfig.id].eval.properties} />
            <Block
              block={context._internal.RootBlocks.map[pageConfig.id]}
              Blocks={context._internal.RootBlocks}
              context={context}
              lowdefy={lowdefy}
            />
          </>
        );
      }}
    </Context>
  );
};

export default Page;