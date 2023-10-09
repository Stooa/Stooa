/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Header from '@/components/Web/Header';
import Footer from '@/components/Web/Footer';
import Decoration from '@/components/Web/Decoration';
import TopDecorationBlob from '@/ui/svg/blobs/top-deco.svg';
import {
  Container,
  Header as HeaderStyled,
  Decoration as DecorationStyled,
  Main,
  TopDecoration
} from '@/layouts/Default/styles';

interface Props {
  navigation?: boolean;
  children: React.ReactNode;
}

const Page = ({ children, navigation = true }: Props) => {
  return (
    <>
      <Container>
        <HeaderStyled>
          <Header navigation={navigation} />
        </HeaderStyled>
        <TopDecoration>
          <TopDecorationBlob />
        </TopDecoration>
        <Main center>{children}</Main>
        <DecorationStyled>
          <Decoration />
        </DecorationStyled>
      </Container>
      <Footer />
    </>
  );
};

export default Page;
