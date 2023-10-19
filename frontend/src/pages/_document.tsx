/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Document, { Html, Main, Head, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import i18nConfig from '@/i18n';

function documentLang({ __NEXT_DATA__ }) {
  const { locale } = __NEXT_DATA__;
  const lang = i18nConfig.locales.find(l => l === locale);

  return lang || i18nConfig.defaultLocale;
}
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang={documentLang(this.props)}>
        <Head></Head>
        <body id="stooa">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
