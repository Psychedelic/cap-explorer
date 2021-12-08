import React from 'react';
import { styled } from '@stitched';
import Loading from '@components/Loading';

const Overall = styled('div', {
  fontSize: '$s',
  boxSizing: 'border-box',
  margin: '0px',
  minWidth: '0px',
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',

  '& > div': {
    boxSizing: 'border-box',
    margin: '0px 1rem 0px 0px',
    minWidth: '0px',
    fontWeight: 500,
    fontSize: '14px',

    '& span': {
      paddingRight: '4px',

      '&[data-name]:after': {
        content: ':',
      },

      '&:nth-child(2)': {
        padding: 0,
        fontWeight: 'bold',
      },
    },
  },
});

const LoadingContainer = styled('span', {
  position: 'relative',
  marginLeft: '10px',
});

interface OverallValuesData {
  name: string;
  value: number;
}

const OverallValues = ({
  data,
  isLoading = true,
}: {
  data: OverallValuesData[],
  isLoading: boolean,
}) => (
  <Overall>
    {
      data.map(({
        name,
        value,
      }) => (
        <div key={name}>
          <span data-name>{name}</span>
          <span>
            {
              isLoading
              ? <LoadingContainer><Loading size='s' alt='' /></LoadingContainer>
              : value
            }
          </span>
        </div>
      ))
    }
  </Overall>
);

export default OverallValues;
