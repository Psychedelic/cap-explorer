/* eslint-disable no-console */
import React, {
  useCallback,
  useEffect,
  useState,
  SetStateAction,
} from 'react';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import Layout from '@components/Layout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';
import loadable from '@loadable/component';
import Loading from '@components/Loading';
import { RouteNames } from '@utils/routes';
import { createBookmarkExpandHandler } from '@utils/account';
import { useAccountStore } from '@hooks/store';
import { CapRouter } from '@psychedelic/cap-js';
import { getCapRouterInstance } from '@utils/cap'; 
import config from './config';

export type BookmarkExpandHandler = (args?: BookmarkExpandHandlerOverrides) => void;

interface BookmarkExpandHandlerOverrides {
  isCollapsed?: boolean,
}

// Dynamic imports
// the wrapped dynamic version of the component could be exported
// from the component path, but we keep it here for clear evidence
// although you can dynamically import inner dependencies
// in the component scope
const LazyOverview = loadable(() => import('@views/Overview'), {
  fallback: <span data-component-loading />,
});

const LazyAppTransactions = loadable(() => import('@views/AppTransactions'), {
  fallback: <span data-component-loading />,
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
  const accountStore = useAccountStore();

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
            accountStore={accountStore}
            capRouterInstance={capRouterInstance}
          />
        </Route>
      </Switch>
    </Layout>
  );
}

const App = () => {
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  // // Mocks async initial request
  // useEffect(() => {
  //   setTimeout(() => setIsLoading(false), 1200);
  // }, []);

  return (
    <Router>
      <Routes
        bookmarkColumnMode={BookmarkColumnModes.collapsed}
        bookmarkExpandHandler={() => null}
        loading={false}
      />
    </Router>
  );
};

export default App;
