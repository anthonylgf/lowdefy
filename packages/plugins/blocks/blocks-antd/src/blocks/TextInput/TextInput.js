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
import { Input } from 'antd';
import { blockDefaultProps } from '@lowdefy/block-utils';

import Label from '../Label/Label.js';
import useRunAfterUpdate from '../../useRunAfterUpdate.js';

const TextInput = ({
  blockId,
  components: { Icon, Link },
  events,
  loading,
  methods,
  properties,
  required,
  validation,
  value,
}) => {
  return (
    <Label
      blockId={blockId}
      components={{ Icon, Link }}
      events={events}
      properties={{ title: properties.title, size: properties.size, ...properties.label }}
      required={required}
      validation={validation}
      content={{
        content: () => {
          const runAfterUpdate = useRunAfterUpdate();
          return (
            <Input
              id={`${blockId}_input`}
              allowClear={properties.allowClear}
              autoFocus={properties.autoFocus}
              bordered={properties.bordered}
              className={methods.makeCssClass(properties.inputStyle)}
              disabled={properties.disabled || loading}
              maxLength={properties.maxLength}
              placeholder={properties.placeholder}
              size={properties.size}
              status={validation.status}
              value={value}
              onChange={(event) => {
                methods.setValue(event.target.value);
                methods.triggerEvent({ name: 'onChange' });
                const cStart = event.target.selectionStart;
                const cEnd = event.target.selectionEnd;
                runAfterUpdate(() => {
                  event.target.setSelectionRange(cStart, cEnd);
                });
              }}
              onPressEnter={() => {
                methods.triggerEvent({ name: 'onPressEnter' });
              }}
              prefix={
                properties.prefix ||
                (properties.prefixIcon && (
                  <Icon
                    blockId={`${blockId}_prefixIcon`}
                    events={events}
                    properties={properties.prefixIcon}
                  />
                ))
              }
              suffix={
                (properties.suffix || properties.suffixIcon) && (
                  <>
                    {properties.suffix && properties.suffix}
                    {properties.suffixIcon && (
                      <Icon
                        blockId={`${blockId}_suffixIcon`}
                        events={events}
                        properties={properties.suffixIcon}
                      />
                    )}
                  </>
                )
              }
            />
          );
        },
      }}
    />
  );
};

TextInput.defaultProps = blockDefaultProps;
TextInput.meta = {
  valueType: 'string',
  category: 'input',
  icons: [...Label.meta.icons],
  styles: ['blocks/TextInput/style.less'],
};

export default TextInput;
