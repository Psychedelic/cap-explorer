import React from 'react';
import { RawLink } from '@components/Link';
import { styled } from '@stitched';
import { RouteNames, getRouteByName } from '@utils/routes';
import Fleekon, { IconNames } from '@components/Fleekon';

export type MenuItemName = 'Overview';

interface MenuItem {
  name: MenuItemName,
  path: RouteNames,
  icon: IconNames,
  title: string,
}

const MenuItems: MenuItem[] = [{
  name: 'Overview',
  path: (getRouteByName('Overview') as RouteNames),
  icon: 'house',
  title: 'Overview',
}];

const Container = styled('nav', {
  fontFamily: 'Inter',
  fontWeight: 'normal',

  // '@initial': {
  //   '& ul': {
  //     display: 'flex',
  //     alignItems: 'center',
  //     height: '100%',

  //     '& svg': {
  //       marginRight: '10px',
  //       fontSize: '$ml',
  //     },

  //     '& li': {
  //       marginRight: '20px',

  //       '&:last-child': {
  //         marginRight: 0,
  //       },
  //     },
  //   },
  // },

  '& ul': {
    display: 'flex',
    alignItems: 'center',
    height: '100%',

    '& svg': {
      marginRight: '10px',
      fontSize: '$ml',
    },

    '& li': {
      marginRight: '20px',

      '&:last-child': {
        marginRight: 0,
      },

      '& .icon-house': {
        position: 'relative',
        top: 2,
      },
    },
  },

  '@lg': {
    '& ul': {
      display: 'block',
      height: 'auto',
    },

    '& li': {
      marginBottom: '$menuItemSpacing',
      marginRight: 0,
      transition: 'opacity 0.2s ease-in',

      '&:hover': {
        '& > a': {
          color: '$purple',
        },
        '& svg': {
          fill: '$purple !important',
        },
      },

      '& > a': {
        fontSize: '$s',
      },
    },
  },
});

const MainMenu = () => (
  <Container
    data-main-menu
  >
    <ul>
      {
        MenuItems.map(
          (item) => (
            <li
              key={item.name}
              data-menu-item={item.name}
            >
              <Fleekon
                icon={item.icon}
                className="icon-house"
              />
              <RawLink
                to={item.path}
              >
                {item.name}
              </RawLink>
            </li>
          ),
        )
      }
    </ul>
  </Container>
);

export default MainMenu;
