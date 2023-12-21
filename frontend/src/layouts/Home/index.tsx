/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Footer from '@/components/Web/Footer';
import Header from '@/components/Web/Header';
import { Main, Container, Header as HeaderStyled } from '@/layouts/Home/styles';

interface Props {
  title?: string;
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return (
    <>
      <Container>
        <HeaderStyled>
          <Header />
        </HeaderStyled>
        <Main>{children}</Main>
      </Container>
      <Footer />
    </>
  );
};

export default Page;
