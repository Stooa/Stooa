/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import { ComponentProps, Ref } from 'react';

type SubmitBtnProps = ComponentProps<'button'> & {
  text: string;
  ref?: Ref<HTMLButtonElement>;
};

const SubmitBtn = ({ text, ...props }: SubmitBtnProps) => {
  return (
    <Button size="large" type="submit" full {...props}>
      {text}
    </Button>
  );
};

export default SubmitBtn;
