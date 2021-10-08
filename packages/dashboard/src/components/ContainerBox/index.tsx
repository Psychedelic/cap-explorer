import React from 'react';
import { css, theme } from '@stitched';

const defaultOptions = {
  background: theme.colors.containerDarkModeGradient,
  borderSize: '1px',
  borderStyle: '$borderDarkModeGradient',
  width: '100%',
  height: 'auto',
};

interface ContainerBoxProps {
  background?: string,
  borderSize?: string,
  borderStyle?: string,
  children: React.ReactNode,
  width?: number,
  height?: number,
  id?: string,
}

const ContainerBox = ({
  background,
  borderSize,
  borderStyle,
  children,
  width,
  height,
  id,
}: ContainerBoxProps) => {
  const containerCss = css({
    display: 'flex',
    width,
    height,
    position: 'relative',
    padding: '1em',
    boxSizing: 'border-box',
    background: background || '$containerDarkModeGradient',
    backgroundClip: 'padding-box',
    border: `solid ${borderSize} transparent`,
    borderRadius: '1em',

    '&:before': {
      content: '',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: '-1',
      margin: `-${borderSize}`,
      borderRadius: 'inherit',
      background: borderStyle,
    },
  });

  return (
    <div className={containerCss()} data-id={id}>
      {children}
    </div>
  );
};

ContainerBox.defaultProps = {
  ...defaultOptions,
  background: '',
};

export default ContainerBox;
