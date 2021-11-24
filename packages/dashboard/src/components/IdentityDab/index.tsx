import React from 'react';
import { styled } from '@stitched';
import iconUnknown from '../../images/icon-unknown.svg';

const IdentityDabContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& span': {
    fontSize: '$S',
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
});

export default ({
  image,
  name,
}: {
  image?: string,
  name: string,
}) => {
  if (!image) {
    return (
      <IdentityDabContainer>
        <img
          src={iconUnknown}
          alt="Unknown"
        />
        <span>{name}</span>
      </IdentityDabContainer>
    )
  }

  return (
    <IdentityDabContainer>
      <img src={image} alt={`Logo for ${name}`} />
      <span>{name}</span>
    </IdentityDabContainer>
  );
}

