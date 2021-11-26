import React, { useState } from 'react';
import { styled } from '@stitched';
import iconUnknown from '../../images/icon-unknown.svg';
import Loading from '@components/Loading';

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

const LoaderContainer = styled('div', {
  position: 'relative',
  width: '45px',
  height: '45px',
  marginRight: '16px',
});

const ImgControlled = styled('img', {
  variants: {
    visible: {
      false: {
        display: 'none',
      },
    }
  },
})

export default ({
  image,
  name,
  large,
  isLoading,
}: {
  image?: string,
  name: string,
  large?: boolean,
  isLoading?: boolean,
}) => {
  const [imgReady, setImgReady] = useState(false);

  if (isLoading) {
    return (
      <LoaderContainer>
        <Loading size='sm' alt='Loading' />
      </LoaderContainer>
    );
  }

  if (!image) {
    return (
      <IdentityDabContainer large={large}>
        {
          !imgReady
          && (
            <LoaderContainer>
              <Loading size='sm' alt='Loading' />
            </LoaderContainer>
          )
        }
        <ImgControlled
          src={iconUnknown}
          alt="Unknown"
          onLoad={() => setImgReady(true)}
          visible={imgReady}
        />
        <span>{name}</span>
      </IdentityDabContainer>
    )
  }

  return (
    <IdentityDabContainer large={large}>
      {
        !imgReady
        && (
          <LoaderContainer>
            <Loading size='sm' alt='Loading' />
          </LoaderContainer>
        )
      }
      <ImgControlled
        src={image}
        alt={`Logo for ${name}`}
        onLoad={() => setImgReady(true)}
        visible={imgReady}
      />
      <span>{name}</span>
    </IdentityDabContainer>
  );
}

