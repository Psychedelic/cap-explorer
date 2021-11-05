import React from 'react';
import { styled } from '@stitched';
import { ExternalLink } from '@components/Link';
import { useSessionStart } from '@hooks/useSessionStart';

const ColumnExternalLinksContainer = styled('ul', {
  flexFlow: 'column',

  '& li': {
    fontSize: '13px',
    fontWeight: 'normal',
    paddingBottom: '12px',

    '& a': {
      transition: 'color 0.3s',
  
      '&:hover': {
        color: '$purple',
      },
    },
  },
});

const ColumnExternalLinks = () => (
  <ColumnExternalLinksContainer
    data-id="column-external-links"
  >
    <li>
      <ExternalLink description="Docs" to="docs" />
    </li>
    <li>
      <ExternalLink description="Discord" to="discord" />
    </li>
    <li>
      <ExternalLink description="Twitter" to="twitter" />
    </li>
  </ColumnExternalLinksContainer>
);

const PollingContainer = styled('div', {
  display: 'flex',
  flexFlow: 'row',
  fontSize: '12px',
  alignItems: 'center',
  gap: '8px',
});

const PollingDot = styled('div', {
  width: '8px',
  height: '8px',
  minHeight: '8px',
  maxHeight: '8px',
  borderRadius: '50%',
  backgroundColor: 'green',
});

const Polling = ({
  sessionTimePassed,
}: {
  sessionTimePassed: number,
}) => (
  <PollingContainer
    data-polling
  >
    <PollingDot />
    {`Updated ${sessionTimePassed > 1 ? `${sessionTimePassed}` : sessionTimePassed} ago`}
  </PollingContainer>
);

const SystemExternalsContainer = styled('div', {
  position: 'absolute',
  bottom: '$sideBarMargin',
  left: '$sideBarMargin',
  display: 'hidden',

  '& > div': {

  },

  '@lg': {
    display: 'grid',
    ridAutoRows: 'auto',
    rowGap: '10px',
  },
});

const SystemExternals = () => {
  const sessionTimePassed = useSessionStart();

  return (
    <SystemExternalsContainer
      data-externals
    >
      <ColumnExternalLinks />
      <Polling sessionTimePassed={(sessionTimePassed as unknown as number)} />
    </SystemExternalsContainer>
  );
};

export default SystemExternals;
