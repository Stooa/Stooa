/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Seo from 'components/Web/Seo';
import Footer from 'components/Web/Footer';
import Header from 'components/Web/Header';
import { Main, Container, Header as HeaderStyled } from 'layouts/Home/styles';

interface Props {
  title?: string;
}

const Page: React.FC<Props> = ({ children, title = '' }) => {
  return (
    <>
      <Seo title={title} />
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
