/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Input, { IInputProps } from 'components/Common/Fields/Input';

const Textarea: React.FC<IInputProps> = props => (
  <Input className="textarea" as="textarea" {...props} />
);

export default Textarea;
