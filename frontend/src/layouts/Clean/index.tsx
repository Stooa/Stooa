/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import { Container, Main } from '@/layouts/Default/styles';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return (
    <Container>
      <Main>{children}</Main>
    </Container>
  );
};

export default Page;
