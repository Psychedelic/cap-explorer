import React from 'react';
import { styled } from '@stitched';
import iconUnknown from '../../images/icon-unknown.svg';

const IdentityDabContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& span': {
    fontSize: '$s',
  },

  '& span, & img, & a': {
    transition: 'all 0.2s',
  },

  '&:hover': {
    '& span, & a': {
      color: '$purple',
    },

    '& > img': {
      opacity: 0.8,
    },
  },

  '& > img': {
    width: '30px',
    height: '30px',
    objectFit: 'cover',
    marginRight: '12px',
    borderRadius: '4px',
  },

  variants: {
    large: {
      true: {
        '& span': {
          fontSize: '$xl',
          fontWeight: 600,
        },
        '& > img': {
          width: '45px',
          height: '45px',
          marginRight: '16px',
        },
      },
    }
  },
});

export default ({
  image,
  name,
  large,
}: {
  image?: string,
  name: string,
  large?: boolean,
}) => {
  if (!image) {
    return (
      <IdentityDabContainer large={large}>
        <img
          src={iconUnknown}
          alt="Unknown"
        />
        <span>{name}</span>
      </IdentityDabContainer>
    )
  }

  return (
    <IdentityDabContainer large={large}>
      <img src={image} alt={`Logo for ${name}`} />
      <span>{name}</span>
    </IdentityDabContainer>
  );
}

