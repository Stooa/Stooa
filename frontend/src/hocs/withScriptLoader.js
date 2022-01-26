/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

const cachedScripts = [];

const scriptLoader =
  (...scriptSrcs) =>
  WrappedComponent => {
    class ScriptLoader extends React.Component {
      state = {
        scriptsLoaded: false,
        scriptsLoadedSuccessfully: false
      };

      _isMounted = false;

      componentDidMount() {
        this._isMounted = true;
        this.loadScripts(scriptSrcs);
      }

      componentWillUnmount() {
        this._isMounted = false;
      }

      loadScripts = srcs => {
        const promises = srcs
          .filter(src => !cachedScripts.includes(src))
          .map(src => this.loadScript(src));

        let success = true;
        Promise.all(promises)
          .catch(() => {
            success = false;
          })
          .then(() => {
            if (!this._isMounted) {
              return;
            }

            this.setState({
              scriptsLoaded: true,
              scriptsLoadedSuccessfully: success
            });
          });
      };

      loadScript = src => {
        cachedScripts.push(src);

        const script = document.createElement('script');
        script.src = src;
        script.async = false;

        const promise = new Promise((resolve, reject) => {
          script.addEventListener('load', () => resolve(src));
          script.addEventListener('error', e => reject(e));
        }).catch(e => {
          const index = cachedScripts.indexOf(src);
          if (index >= 0) cachedScripts.splice(index, 1);
          script.remove();

          throw e;
        });

        document.body.appendChild(script);

        return promise;
      };

      render() {
        const props = {
          ...this.props,
          ...this.state
        };

        return <WrappedComponent {...props} />;
      }
    }

    return hoistStatics(ScriptLoader, WrappedComponent);
  };

export default scriptLoader;
