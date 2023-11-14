/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Decoration from '@/components/Web/Decoration';
import Footer from '@/components/Web/Footer';
import Header from '@/components/Web/Header';
import {
  Container,
  Header as HeaderStyled,
  Decoration as DecorationStyled,
  Main
} from '@/layouts/Default/styles';

interface Props {
  center?: boolean;
  decorated?: boolean;
  navigation?: boolean;
  title?: string;
  children: React.ReactNode;
  positionDefault?: boolean;
}

const Page = ({
  children,
  center = true,
  decorated = false,
  navigation = true,
  positionDefault
}: Props) => (
  <>
    <Container className={decorated ? 'decorated' : ''}>
      <HeaderStyled>
        <Header navigation={navigation} />
      </HeaderStyled>
      <Main positionDefault={positionDefault} center={center}>
        {children}
      </Main>
      {decorated && (
        <DecorationStyled>
          <Decoration />
        </DecorationStyled>
      )}
    </Container>
    <Footer />
  </>
);

export default Page;
