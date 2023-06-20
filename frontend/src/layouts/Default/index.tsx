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
import Seo from '@/components/Web/Seo';
import {
  Container,
  Header as HeaderStyled,
  Decoration as DecorationStyled,
  Main
} from '@/layouts/Default/styles';

interface Props {
  horizontalAlign?: 'flex-start' | 'center' | 'flex-end';
  verticalAlign?: 'flex-start' | 'center' | 'flex-end';
  decorated?: boolean;
  navigation?: boolean;
  title?: string;
  children: React.ReactNode;
}

const Page = ({
  children,
  horizontalAlign = 'center',
  verticalAlign = 'center',
  decorated = false,
  navigation = true,
  title = ''
}: Props) => (
  <>
    <Seo title={title} />
    <Container className={decorated ? 'decorated' : ''}>
      <HeaderStyled>
        <Header navigation={navigation} />
      </HeaderStyled>
      <Main verticalAlign={verticalAlign} horizontalAlign={horizontalAlign}>
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
