/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Container, Content } from 'components/Common/PopUp/styles';

const PopUp = ({ children, open }) => (
  <Container open={open}>
    <Content>{children}</Content>
  </Container>
);

export default PopUp;
