import React from 'react';
import { styled } from '@stitched';
import MainMenu from '@components/MainMenu';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import Loading from '@components/Loading';
import imgCapLogo from '@images/cap-logo.svg';
import interRegularWoff2 from '@fonts/Inter-Regular.woff2';
import interRegularWoff from '@fonts/Inter-Regular.woff';
import { addFontFace, getFontSrc } from '@utils/font-face';
import { globalStyles } from '@utils/styles';
import SystemExternals from '@components/SystemExternals';
import { BookmarkExpandHandler } from '../../App';

const MainContainer = styled('div', {
  display: 'grid',

  variants: {
    mode: {
      collapsed: {
        '@lg': {
          gridTemplateColumns: '220px 1fr 64px',
        },
      },
      expanded: {
        '@lg': {
          gridTemplateColumns: '220px 1fr 200px',
        },
      },
    },
    showBookmarkCol: {
      false: {
        '@lg': {
          gridTemplateColumns: '220px 1fr',

          '& > div:nth-child(3)': {
            display: 'none',
          },
        },
      },
    },
  },

  // '@initial': {
  //   gridTemplateColumns: '1fr',
  //   maxWidth: '100vw',
  //   gap: 0,
  // },

  gridTemplateColumns: '1fr',
  maxWidth: '100vw',
  gap: 0,
});

const Sidebar = styled('div', {
  zIndex: 9999,
  boxSizing: 'border-box',
  background: '$gradientDarkModeLighter',

  // '@initial': {
  //   height: 'auto',
  // },
  
  height: 'auto',

  '@lg': {
    position: 'sticky',
    top: 0,
    height: '100vh',
  },

  '& p': {
    color: 'white',
  },
});

const SidebarContainer = styled('div', {
  padding: '$sideBarMargin',
  paddingTop: '33px',

  // '@initial': {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  // },

  display: 'flex',
  justifyContent: 'space-between',

  '@lg': {
    display: 'block',
    height: 34,

    '& img:first-child': {
      marginBottom: '36px',
    },
  },
});

const Content = styled('div', {
  height: '100%',
  zIndex: 9999,
  transition: 'width 0.25s ease 0s',
  background: '$gradientDarkModeDarker',
  position: 'relative',

  // '@initial': {
  //   minHeight: '100vh',
  // },

  minHeight: '100vh',

  '@lg': {
    minHeight: 'auto',
  },
});

const ContentChild = styled('div', {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '40px 30px',
  overflow: 'hidden',
});

const BookmarkCol = styled('div', {
  position: 'sticky',
  right: 0,
  top: 0,
  zIndex: 9999,
  height: '100vh',
  background: '$gradientDarkModeDarker',
  borderLeft: '1px solid $borderGrey',

  variants: {
    mode: {
      collapsed: {
        width: 64,
      },
      expanded: {
        width: 200,
      },
    },
  },

  // '@initial': {
  //   display: 'none',
  // },

  display: 'none',

  '@lg': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',

    '& > div': {
      paddingTop: '$menuItemSpacing',
    },
  },
});

const CapLogo = styled('img', {
  // '@initial': {
  //   width: 'auto',
  //   height: 26,
  // },

  width: 'auto',
  height: 26,

  '@lg': {
    height: 34,
  },
});

const BlankContainer = styled('div', {
  width: '100vw',
  height: '100vh',
  background: '$gradientDarkModeDarker',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Layout = ({
  children,
  bookmarkColumnMode,
  bookmarkExpandHandler,
  loading,
  showBookmarkCol,
}: {
  children: React.ReactNode,
  bookmarkColumnMode: BookmarkColumnModes,
  bookmarkExpandHandler: BookmarkExpandHandler,
  loading: boolean,
  showBookmarkCol: boolean,
}) => {
  globalStyles();
  addFontFace({
    fontFamily: 'Inter',
    fontSrc: getFontSrc(interRegularWoff2, interRegularWoff),
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  });

  return (
    (
      loading
      && (
      <BlankContainer>
        <Loading alt="Loading the application" size="m" />
      </BlankContainer>
      )
    )
    || (
      <MainContainer
        mode={bookmarkColumnMode}
        showBookmarkCol={showBookmarkCol}
        data-layout
      >
        <Sidebar>
          <SidebarContainer>
            <CapLogo src={imgCapLogo} alt="cap logo" />
            <MainMenu />
          </SidebarContainer>
          <SystemExternals />
        </Sidebar>
        <Content>
          <ContentChild>
            { children }
          </ContentChild>
        </Content>
      </MainContainer>
    )
  );
};

export default Layout;
