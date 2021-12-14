/* eslint-disable no-console */
import React, {
  useEffect,
  useState,
} from 'react';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import Layout from '@components/Layout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import loadable from '@loadable/component';
import { RouteNames } from '@utils/routes';
import { CapRouter } from '@psychedelic/cap-js';
import { getCapRouterInstance } from '@utils/cap'; 
import config from './config';
import { LoadableLoadingPlaceholder } from '@components/LoadingForLoadable';

export type BookmarkExpandHandler = (args?: BookmarkExpandHandlerOverrides) => void;

interface BookmarkExpandHandlerOverrides {
  isCollapsed?: boolean,
}

// Dynamic imports
// the wrapped dynamic version of the component could be exported
// from the component path, but we keep it here for clear evidence
// although you can dynamically import inner dependencies
// in the component scope
const LazyOverview = loadable(() => import(/* webpackPreload: true */ '@views/Overview'), {
  // The fallback to blank is intentional
  // which transitions to the loader for slower internet connections
  fallback: <LoadableLoadingPlaceholder alt="Loading Overview page" />,
});

const LazyAppTransactions = loadable(() => import(/* webpackPrefetch: true */ '@views/AppTransactions'), {
  // The fallback to blank is intentional
  // which transitions to the loader for slower internet connections
  fallback: <LoadableLoadingPlaceholder alt="Loading App Transactions page" />,
});

const Routes = ({
  bookmarkColumnMode,
  bookmarkExpandHandler,
  loading,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
  bookmarkExpandHandler: BookmarkExpandHandler,
  loading: boolean,
}) => {
  const [capRouterInstance, setCapRouterInstance] = useState<CapRouter | undefined>();

  useEffect(() => {
    // On App launch, initialises CapRouter instance
    // as it can be reused during App lifetime
    (async () => {
      const capRouterInstance = await getCapRouterInstance({
        canisterId: config.canisterId,
        host: config.host,
      });

      setCapRouterInstance(capRouterInstance);
    })();
  }, []);

  return (
    <Layout
      bookmarkColumnMode={bookmarkColumnMode}
      bookmarkExpandHandler={bookmarkExpandHandler}
      loading={loading}
      showBookmarkCol={false}
    >
      <Switch>
        <Route path={RouteNames.AppTransactions}>
          <LazyAppTransactions
            capRouterInstance={capRouterInstance}
          />
        </Route>
        <Route path={RouteNames.Overview}>
          <LazyOverview
            capRouterInstance={capRouterInstance}
          />
        </Route>
      </Switch>
    </Layout>
  );
}

const App = () => (
  <Router>
    <Routes
      bookmarkColumnMode={BookmarkColumnModes.collapsed}
      bookmarkExpandHandler={() => null}
      loading={false}

    />
  </Router>
);

export default App;
