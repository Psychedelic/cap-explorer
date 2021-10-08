import React from 'react';
import { styled } from '@stitched';

const Container = styled('div', {
  width: '100%',
  height: '100%',

  '> *': {
    paddingBottom: '$pageItemSpacing',
  },
});

export const PageRow = styled('div', {
  width: '100%',
  height: 'auto',
  position: 'relative',
});

export type PageId = 'overview' | 'accounts' | 'account';

const Page = ({
  children,
  pageId,
}: {
  children: React.ReactNode,
  pageId: PageId,
}) => (
  <Container
    data-page-id={pageId}
  >
    {children}
  </Container>
);

export default Page;
