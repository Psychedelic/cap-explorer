import React from 'react';
import { RawLink } from '@components/Link';
import { styled } from '@stitched';
import Icon, { IconType } from '@components/Icon';
import { RouteNames, getRouteByName } from '@utils/routes';

export type MenuItemName = 'Home' | 'Accounts';

interface MenuItem {
  name: MenuItemName,
  path: RouteNames,
  icon: IconType,
  title: string,
}

const MenuItems: MenuItem[] = [{
  name: 'Home',
  path: (getRouteByName('Home') as RouteNames),
  icon: 'HomeAlt',
  title: 'Home',
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
        opacity: 0.7,
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
              <Icon
                icon={item.icon}
                size="sm"
                title={item.title}
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
