import React from 'react';
import { styled } from '@stitched';
import Fleekon from '@components/Fleekon';
import { RawLink } from '@components/Link';
import {
  CanisterMetadata,
  DAB_IDENTITY_UNKNOWN,
} from '@utils/dab';
import Loading from '@components/Loading';

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

const LoadingContainer = styled('span', {
  width: '14px',
  height: '14px',
  position: 'relative',
  marginLeft: '10px',
});

export interface BreadcrumbProps {
  identityInDab?: CanisterMetadata,
  isLoading: boolean,
}

const Breadcrumb = ({
  identityInDab,
  isLoading,
}: BreadcrumbProps) => {

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
      {
        isLoading
        ? (
          <LoadingContainer>
            <Loading size='s' alt='' />
          </LoadingContainer>
        )
        : (
          <span>
          {
            identityInDab
            ? identityInDab?.name
            : DAB_IDENTITY_UNKNOWN
          }
          </span>
        )
      }
    </Container>
  );
};

export default Breadcrumb;
