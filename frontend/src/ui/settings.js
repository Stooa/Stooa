/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import colors from '@/ui/design-tokens/colors.json';

const BREAKPOINTS = {
  desktop: 1024,
  desktopLarge: 1280,
  desktopXL: 1440,
  form: 374,
  maxWidth: 1200,
  phone: 480,
  reader: 550,
  tablet: 768,
  tabletLarge: 992
};

const BORDER_RADIUS = '5px';

const _getDesignToken = colorName => (colors.colors[colorName] ? colors.colors[colorName].hexColor : '');

// Colors
const COLOR_NEUTRO_100 = _getDesignToken('neutral100');
const COLOR_NEUTRO_200 = _getDesignToken('neutral200');
const COLOR_NEUTRO_300 = _getDesignToken('neutral300');
const COLOR_NEUTRO_400 = _getDesignToken('neutral400');
const COLOR_NEUTRO_500 = _getDesignToken('neutral500');
const COLOR_NEUTRO_600 = _getDesignToken('neutral600');
const COLOR_NEUTRO_700 = _getDesignToken('neutral700');
const COLOR_NEUTRO_800 = _getDesignToken('neutral800');
const COLOR_NEUTRO_900 = _getDesignToken('neutral900');

const COLOR_PURPLE_100 = _getDesignToken('bPurple100');
const COLOR_PURPLE_200 = _getDesignToken('bPurple200');
const COLOR_PURPLE_300 = _getDesignToken('bPurple300');
const COLOR_PURPLE_400 = _getDesignToken('bPurple400');
const COLOR_PURPLE_500 = _getDesignToken('bPurple500');
const COLOR_PURPLE_600 = _getDesignToken('bPurple600');
const COLOR_PURPLE_700 = _getDesignToken('bPurple700');
const COLOR_PURPLE_800 = _getDesignToken('bPurple800');
const COLOR_PURPLE_900 = _getDesignToken('bPurple900');

const COLOR_GREEN_100 = _getDesignToken('bGreen100');
const COLOR_GREEN_200 = _getDesignToken('bGreen200');
const COLOR_GREEN_300 = _getDesignToken('bGreen300');
const COLOR_GREEN_400 = _getDesignToken('bGreen400');
const COLOR_GREEN_500 = _getDesignToken('bGreen500');
const COLOR_GREEN_600 = _getDesignToken('bGreen600');
const COLOR_GREEN_700 = _getDesignToken('bGreen700');
const COLOR_GREEN_800 = _getDesignToken('bGreen800');
const COLOR_GREEN_900 = _getDesignToken('bGreen900');

const COLOR_RED_100 = _getDesignToken('bRed100');
const COLOR_RED_200 = _getDesignToken('bRed200');
const COLOR_RED_300 = _getDesignToken('bRed300');
const COLOR_RED_400 = _getDesignToken('bRed400');
const COLOR_RED_500 = _getDesignToken('bRed500');
const COLOR_RED_600 = _getDesignToken('bRed600');
const COLOR_RED_700 = _getDesignToken('bRed700');
const COLOR_RED_800 = _getDesignToken('bRed800');
const COLOR_RED_900 = _getDesignToken('bRed900');

const COLOR_YELLOW_100 = _getDesignToken('bYellow100');
const COLOR_YELLOW_200 = _getDesignToken('bYellow200');
const COLOR_YELLOW_300 = _getDesignToken('bYellow300');
const COLOR_YELLOW_400 = _getDesignToken('bYellow400');
const COLOR_YELLOW_500 = _getDesignToken('bYellow500');
const COLOR_YELLOW_600 = _getDesignToken('bYellow600');
const COLOR_YELLOW_700 = _getDesignToken('bYellow700');
const COLOR_YELLOW_800 = _getDesignToken('bYellow800');
const COLOR_YELLOW_900 = _getDesignToken('bYellow900');

// Font
const FONT_PRIMARY = 'Geomanist, Helvetica, Arial, sans-serif';
const FONT_BASE_SIZE = 16;
const SPACE = 8;

export {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLOR_NEUTRO_100,
  COLOR_NEUTRO_200,
  COLOR_NEUTRO_300,
  COLOR_NEUTRO_400,
  COLOR_NEUTRO_500,
  COLOR_NEUTRO_600,
  COLOR_NEUTRO_700,
  COLOR_NEUTRO_800,
  COLOR_NEUTRO_900,
  COLOR_PURPLE_100,
  COLOR_PURPLE_200,
  COLOR_PURPLE_300,
  COLOR_PURPLE_400,
  COLOR_PURPLE_500,
  COLOR_PURPLE_600,
  COLOR_PURPLE_700,
  COLOR_PURPLE_800,
  COLOR_PURPLE_900,
  COLOR_GREEN_100,
  COLOR_GREEN_200,
  COLOR_GREEN_300,
  COLOR_GREEN_400,
  COLOR_GREEN_500,
  COLOR_GREEN_600,
  COLOR_GREEN_700,
  COLOR_GREEN_800,
  COLOR_GREEN_900,
  COLOR_RED_100,
  COLOR_RED_200,
  COLOR_RED_300,
  COLOR_RED_400,
  COLOR_RED_500,
  COLOR_RED_600,
  COLOR_RED_700,
  COLOR_RED_800,
  COLOR_RED_900,
  COLOR_YELLOW_100,
  COLOR_YELLOW_200,
  COLOR_YELLOW_300,
  COLOR_YELLOW_400,
  COLOR_YELLOW_500,
  COLOR_YELLOW_600,
  COLOR_YELLOW_700,
  COLOR_YELLOW_800,
  COLOR_YELLOW_900,
  FONT_BASE_SIZE,
  FONT_PRIMARY,
  SPACE
};
