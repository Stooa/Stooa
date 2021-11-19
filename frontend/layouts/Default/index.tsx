/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Decoration from 'components/Web/Decoration';
import Footer from 'components/Web/Footer';
import Header from 'components/Web/Header';
import Seo from 'components/Web/Seo';
import {
  Container,
  Header as HeaderStyled,
  Decoration as DecorationStyled,
  Main
} from 'layouts/Default/styles';

interface Props {
  center?: boolean;
  decorated?: boolean;
  navigation?: boolean;
  title?: string;
}

const Page: React.FC<Props> = ({
  children,
  center = true,
  decorated = false,
  navigation = true,
  title = ''
}) => (
  <>
    <Seo title={title} />
    <Container className={decorated ? 'decorated' : ''}>
      <HeaderStyled>
        <Header navigation={navigation} />
      </HeaderStyled>
      <Main center={center}>{children}</Main>
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
