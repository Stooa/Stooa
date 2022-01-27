/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { css } from 'styled-components';

const Button = css`
  input[type='submit'],
  input[type='reset'],
  input[type='button'],
  button {
    border: none;
    cursor: pointer;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;

    &:focus {
       outline: none;
    }
  }

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`;

export { Button };
