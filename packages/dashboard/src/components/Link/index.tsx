import React from 'react';
import {
  Link as RouterLink,
} from 'react-router-dom';
import { styled } from '@stitched';
import { RouteNames, getRouteByName } from '@utils/routes';
import { trimAccount } from '@utils/account';

const Container = styled('span', {
  a: {
    color: '$defaultTxtColour',
    transition: 'opacity 0.2s',

    '&:hover': {
      color: '$purple',
    },
  },

  variants: {
    tableLink: {
      true: {
        a: {
          color: '$defaultTxtColour',

          '&:hover': {
            color: '$purple',
          },
        },
      },
    },
  },
});

export const RawLink = ({
  to,
  children,
}: {
  to: RouteNames | string,
  children: React.ReactNode,
}) => (
  <RouterLink to={to}>
    {children}
  </RouterLink>
);

export const PrimaryLink = ({
  to,
  children,
  tableLink = false,
}: {
  to: string,
  children: React.ReactNode,
  tableLink: boolean,
}) => (
  <Container tableLink={tableLink}>
    <RouterLink to={to}>
      {children}
    </RouterLink>
  </Container>
);

enum ExternalLinks {
  docs = 'docs.cap.ooo',
  discord = 'discord.gg/yVEcEzmrgm',
  twitter = 'twitter.com/cap_ois',
}

export const ExternalLink = ({
  description,
  to,
}: {
  description: string,
  to: keyof typeof ExternalLinks,
}) => (
  <Container>
    <a rel="noreferrer" target="_blank" href={`https://${ExternalLinks[to]}`}>
      { description }
    </a>
  </Container>
);

export const AccountLink = ({
  account,
  trim,
}: {
  account: string,
  trim: boolean,
}) => (
  <PrimaryLink
    to={getRouteByName('AppTransactions', { id: account })}
    tableLink={true}
  >
    {trim ? trimAccount(account) : account}
  </PrimaryLink>
);


export const NamedAccountLink = ({
  account,
  name,
  trim,
}: {
  name: string,
  account: string,
  trim?: boolean,
}) => (
  <PrimaryLink
    to={getRouteByName('AppTransactions', { id: account })}
    tableLink={true}
  >
    {trim ? trimAccount(name) : name}
  </PrimaryLink>
);

export const NamedLink = ({
  url,
  name,
  target = '_blank',
}: {
  url: string,
  name: string,
  target?: string,
}) => (
  <Container tableLink={false}>
    <a href={url} target={target}>
      {name}
    </a>
  </Container>
);
