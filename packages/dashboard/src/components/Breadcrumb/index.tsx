import React from 'react';
import { styled, BREAKPOINT_LG } from '@stitched';
import { useWindowResize } from '@hooks/windowResize';
import { trimAccount } from '@utils/account';
import Fleekon from '@components/Fleekon';

const Container = styled('div', {
  fontFamily: 'Inter',
  fontWeight: 'normal',
  color: '$defaultTxtColour',

  '& span': {
    lineHeight: '$normal',
    fontSize: '$s',

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
}

const Breadcrumb = ({ id }: BreadcrumbProps) => {
  const isSmallerThanBreakpointLG = useWindowResize({
    breakpoint: BREAKPOINT_LG,
  });

  return (
    <Container
      data-id="breadcrumb"
    >
      <span>Overview</span>
      <Fleekon
        icon="arrowRight"
        className="arrow"
        size="13px"
      />
      {/* TODO: Use DabJS to get token contract name */}
      <span>{isSmallerThanBreakpointLG ? trimAccount(id) : id }</span>
    </Container>
  );
};

export default Breadcrumb;
