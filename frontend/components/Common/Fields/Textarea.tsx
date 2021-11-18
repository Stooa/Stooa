/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import { Input } from '@/types/input';
import InputField from 'components/Common/Fields/Input';

const Textarea: React.FC<Input> = props => (
  <InputField className="textarea" as="textarea" {...props} />
);

export default Textarea;
