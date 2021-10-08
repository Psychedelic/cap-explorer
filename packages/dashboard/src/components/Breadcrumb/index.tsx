import React from 'react';
import { styled, BREAKPOINT_LG } from '@stitched';
import { useWindowResize } from '@hooks/windowResize';
import imgBreadcrumbArrow from '@images/breadcrumb-arrow.svg';
import { trimAccount } from '@utils/account';

const Container = styled('div', {
  fontFamily: 'Inter',
  fontWeight: 'normal',
  color: '$defaultTxtColour',

  '& span': {
    lineHeight: '$normal',
    fontSize: '$s',

    '&::after': {
      content: '" "',
      background: `url(${imgBreadcrumbArrow})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      width: '13px',
      height: '20px',
      display: 'inline-block',
      position: 'relative',
      transform: 'translateY(7px)',
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
      <span>Accounts</span>
      <span>{isSmallerThanBreakpointLG ? trimAccount(id) : id }</span>
    </Container>
  );
};

export default Breadcrumb;
