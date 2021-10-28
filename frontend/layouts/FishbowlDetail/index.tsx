/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Header from 'components/Web/FishbowlDetailHeader';
import Footer from 'components/Web/Footer';
import Decoration from 'components/Web/Decoration';
import {
  Container,
  Header as HeaderStyled,
  Footer as FooterStyled,
  Decoration as DecorationStyled,
  Main
} from 'layouts/Default/styles';

interface IProps {
  children: any;
  data: any;
}

const Page: React.FC<IProps> = ({ children, data }) => {
  return (
    <>
      <Container>
        <HeaderStyled>
          <Header data={data} />
        </HeaderStyled>
        <Main center>{children}</Main>
        <DecorationStyled>
          <Decoration />
        </DecorationStyled>
      </Container>
      <FooterStyled>
        <Footer />
      </FooterStyled>
    </>
  );
};

export default Page;
