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
  useLocation,
} from 'react-router-dom';
import loadable from '@loadable/component';
import Loading from '@components/Loading';
import { RouteNames } from '@utils/routes';
import { createBookmarkExpandHandler } from '@utils/account';

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
  fallback: <Loading alt="Loading overview page" size="m" />,
});

const Routes = ({
  bookmarkColumnMode,
  bookmarkExpandHandler,
  loading,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
  bookmarkExpandHandler: BookmarkExpandHandler,
  loading: boolean,
}) => (
  <Layout
    bookmarkColumnMode={bookmarkColumnMode}
    bookmarkExpandHandler={bookmarkExpandHandler}
    loading={loading}
    showBookmarkCol={false}
  >
    <Switch>
      <Route path={RouteNames.Home}>
        <LazyOverview
          bookmarkColumnMode={bookmarkColumnMode}
        />
      </Route>
    </Switch>
  </Layout>
);

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [
    bookmarkColumnMode,
    setBookmarkColumnMode,
  ] = useState<BookmarkColumnModes>(BookmarkColumnModes.collapsed);
  const bookmarkExpandHandler = useCallback(createBookmarkExpandHandler({
    bookmarkColumnMode,
    setBookmarkColumnMode,
  }), [bookmarkColumnMode, setBookmarkColumnMode]);

  // Mocks async initial request
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  return (
    <Router>
      <Routes
        bookmarkColumnMode={bookmarkColumnMode}
        bookmarkExpandHandler={bookmarkExpandHandler}
        loading={isLoading}
      />
    </Router>
  );
};

export default App;
