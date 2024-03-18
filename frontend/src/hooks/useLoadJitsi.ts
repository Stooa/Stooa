/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useJitsi } from '@/lib/useJitsi';
import { useEffect, useState } from 'react';

const useLoadJitsi = (scriptsLoaded: boolean) => {
  const { initializeJitsi, unload } = useJitsi();
  const [loadedJitsi, setLoadedJitsi] = useState(!!window.JitsiMeetJS);

  const importJitsi = async () => {
    if (loadedJitsi) return;

    let importedJitsiMeetJs;

    try {
      // @ts-expect-error: lib-jitsi-meet not found
      importedJitsiMeetJs = (await import('lib-jitsi-meet')).default;
    } catch (error) {
      return;
    }

    window.JitsiMeetJS = importedJitsiMeetJs;

    setLoadedJitsi(true);
  };

  useEffect(() => {
    if (scriptsLoaded && loadedJitsi) {
      initializeJitsi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptsLoaded, loadedJitsi]);

  useEffect(() => {
    importJitsi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', unload);
    window.addEventListener('unload', unload);

    return () => {
      window.removeEventListener('beforeunload', unload);
      window.removeEventListener('unload', unload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loadedJitsi };
};

export default useLoadJitsi;
