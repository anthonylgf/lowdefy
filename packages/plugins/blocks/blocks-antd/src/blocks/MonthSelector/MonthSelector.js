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
import { DatePicker } from 'antd';
import moment from 'moment';
import { blockDefaultProps } from '@lowdefy/block-utils';
import { type } from '@lowdefy/helpers';

import Label from '../Label/Label.js';
import disabledDate from '../../disabledDate.js';

const MonthPicker = DatePicker.MonthPicker;

const MonthSelector = ({
  blockId,
  components: { Icon },
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
      components={{ Icon }}
      events={events}
      properties={{ title: properties.title, size: properties.size, ...properties.label }}
      required={required}
      validation={validation}
      content={{
        content: () => (
          <div className={methods.makeCssClass({ width: '100%' })}>
            <div id={`${blockId}_popup`} />
            <MonthPicker
              id={`${blockId}_input`}
              allowClear={properties.allowClear !== false}
              autoFocus={properties.autoFocus}
              bordered={properties.bordered}
              className={methods.makeCssClass([{ width: '100%' }, properties.inputStyle])}
              disabled={properties.disabled || loading}
              disabledDate={disabledDate(properties.disabledDates)}
              format={properties.format || 'YYYY-MM'}
              getPopupContainer={() => document.getElementById(`${blockId}_popup`)}
              placeholder={properties.placeholder || 'Select Month'}
              size={properties.size}
              status={validation.status}
              value={type.isDate(value) ? moment.utc(value).startOf('month') : null}
              suffixIcon={
                <Icon
                  blockId={`${blockId}_suffixIcon`}
                  events={events}
                  properties={properties.suffixIcon || 'AiOutlineCalendar'}
                />
              }
              onChange={(newVal) => {
                methods.setValue(
                  !newVal
                    ? null
                    : moment
                        .utc(newVal.add(newVal.utcOffset(), 'minutes'))
                        .startOf('month')
                        .toDate()
                );
                methods.triggerEvent({ name: 'onChange' });
              }}
            />
          </div>
        ),
      }}
    />
  );
};

MonthSelector.defaultProps = blockDefaultProps;
MonthSelector.meta = {
  valueType: 'date',
  category: 'input',
  icons: [...Label.meta.icons, 'AiOutlineCalendar'],
  styles: ['blocks/MonthSelector/style.less'],
};

export default MonthSelector;
