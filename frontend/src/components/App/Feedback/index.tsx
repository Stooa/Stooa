/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import Button from '@/ui/Button';

const Feedback = () => {
  const createFeedback = () => {
    console.log('crate');
  };

  const updateFeedback = () => {
    console.log('crate');
  };

  return (
    <>
      <Button onClick={() => createFeedback()}>Create Feedback</Button>
      <Button onClick={() => updateFeedback()}>Update Feedback</Button>
    </>
  );
};

export default Feedback;
