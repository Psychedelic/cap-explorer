/* eslint-disable no-console */
import React, {
  useCallback,
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
import {
  useAccountStore,
  useDabStore,
} from '@hooks/store';
import { CapRouter } from '@psychedelic/cap-js';
import { getCapRouterInstance } from '@utils/cap'; 
import { TokenContractKeyPairedStandard, DABCollection } from '@utils/dab';
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
const LazyOverview = loadable(() => import('@views/Overview'), {
  // The fallback to blank is intentional
  // which transitions to the loader for slower internet connections
  fallback: <LoadableLoadingPlaceholder alt="Loading Overview page" />,
});

const LazyAppTransactions = loadable(() => import('@views/AppTransactions'), {
  // The fallback to blank is intentional
  // which transitions to the loader for slower internet connections
  fallback: <LoadableLoadingPlaceholder alt="Loading App Transactions page" />,
});

const Routes = ({
  bookmarkColumnMode,
  bookmarkExpandHandler,
  loading,
  tokenContractKeyPairedStandard,
  dabCollection,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
  bookmarkExpandHandler: BookmarkExpandHandler,
  loading: boolean,
  tokenContractKeyPairedStandard: TokenContractKeyPairedStandard,
  dabCollection: DABCollection,
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
            tokenContractKeyPairedStandard={tokenContractKeyPairedStandard}
          />
        </Route>
        <Route path={RouteNames.Overview}>
          <LazyOverview
            accountStore={accountStore}
            capRouterInstance={capRouterInstance}
            dabCollection={dabCollection}
          />
        </Route>
      </Switch>
    </Layout>
  );
}

const App = () => {
  // At time of writing we get the complete DAB Collection
  // once the Service changes to support pagination
  // this will have to change
  const {
    fetchDabCollection,
    tokenContractKeyPairedStandard,
    dabCollection,
  } = useDabStore();

  useEffect(() => {
    // Required to use as a lookup table to
    // identify the token contract nft standard
    // at time of writing the getAllNFTs is used
    // and while this works for now, it's not scalable
    // as the list increases; a nft registry is under dev
    fetchDabCollection();
  }, []);

  useEffect(() => {
    console.log('[debug] dabCollection', dabCollection)
  }, [dabCollection])

  return (
    <Router>
      <Routes
        bookmarkColumnMode={BookmarkColumnModes.collapsed}
        bookmarkExpandHandler={() => null}
        loading={false}
        tokenContractKeyPairedStandard={tokenContractKeyPairedStandard}
        dabCollection={dabCollection}
      />
    </Router>
  );
}

export default App;
