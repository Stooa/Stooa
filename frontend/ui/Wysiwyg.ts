/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import styled from 'styled-components';

import { space, rems } from 'ui/helpers';

const Wysiwyg = styled.div`
  margin: ${space(4)} auto 0;
  max-width: ${rems(615)};
  text-align: left;
  width: 100%;

  * {
    margin-bottom: ${space(2)};
  }

  * + .title-md {
    margin-top: ${space(8)};
  }

  .section {
    margin-bottom: ${space(6)};
  }

  a {
    text-decoration: underline;
  }

  ul {
    li {
      position: relative;

      &::before {
        background: currentColor;
        border-radius: 50%;
        content: '';
        height: 2px;
        transform: translateY(-4px);
        width: 2px;
        display: inline-block;
        margin-right: ${space()};
        position: relative;
      }
    }
  }
`;

export default Wysiwyg;
