import React from 'react';
import { styled } from '@stitched';

const IdentityDabContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& > img': {
    width: '20px',
    height: '20px',
    objectFit: 'cover',
    marginRight: '10px',
    borderRadius: '50%',
  },
});

export default ({
  image,
  name,
}: {
  image: string,
  name: string,
}) => (
  <IdentityDabContainer>
    <img src={image} alt={`Logo for ${name}`} />
    <span>{name}</span>
  </IdentityDabContainer>
);

