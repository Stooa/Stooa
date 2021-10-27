/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from 'ui/Button';

const SubmitBtn = ({ text, disabled, ...props }) => {
  return (
    <Button type="submit" full {...props} disabled={disabled}>
      {text}
    </Button>
  );
};

export default SubmitBtn;
