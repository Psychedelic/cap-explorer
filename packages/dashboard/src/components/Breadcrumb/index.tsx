import React from 'react';
import { styled, BREAKPOINT_LG } from '@stitched';
import { useWindowResize } from '@hooks/windowResize';
import { trimAccount } from '@utils/account';
import Fleekon from '@components/Fleekon';
import { RawLink } from '@components/Link';
import { CanisterMetadata } from '@utils/dab';

const Hover = styled('span', {
  transition: 'color 0.2s',

  '&:hover': {
    color: '$purple',
  },
});

const Container = styled('div', {
  fontFamily: 'Inter',
  fontWeight: 'normal',
  color: '$defaultTxtColour',

  '& span': {
    lineHeight: '$normal',
    fontSize: '$s',
    textTransform: 'capitalize',

    '& .arrow': {
      width: '13px',
      height: '20px',
      display: 'inline-block',
      position: 'relative',
      transform: 'translateY(2px)',
      margin: '0 10px',
    },

    '&:last-child': {
      '&::after': {
        display: 'none',
      },
    },
  },
});

export interface BreadcrumbProps {
  id: string,
  identityInDab?: CanisterMetadata,
}

const Breadcrumb = ({
  id,
  identityInDab,
}: BreadcrumbProps) => {
  const isSmallerThanBreakpointLG = useWindowResize({
    breakpoint: BREAKPOINT_LG,
  });

  return (
    <Container
      data-id="breadcrumb"
    >
      <RawLink to='/'>
        <Hover>Overview</Hover>
      </RawLink>
      <Fleekon
        icon="arrowRight"
        className="arrow"
        size="13px"
      />
      <span>
        {
          identityInDab
          ? identityInDab?.name
          // : isSmallerThanBreakpointLG ? trimAccount(id) : id
          : 'unknown'
        }
      </span>
    </Container>
  );
};

export default Breadcrumb;
