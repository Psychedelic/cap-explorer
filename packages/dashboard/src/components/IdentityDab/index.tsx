import React from 'react';
import { styled } from '@stitched';
import { NamedLink } from '@components/Link';

const IdentityDabContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

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
    width: '20px',
    height: '20px',
    objectFit: 'cover',
    marginRight: '10px',
    borderRadius: '4px',
  },
});

const Unnamed = styled('span', {
  fontWeight: 'bold',
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
      <Unnamed>
        <NamedLink url={'https://dab.ooo'} name='Unnamed' />
      </Unnamed>
    )
  }

  return (
    <IdentityDabContainer>
      <img src={image} alt={`Logo for ${name}`} />
      <span>{name}</span>
    </IdentityDabContainer>
  );
}

