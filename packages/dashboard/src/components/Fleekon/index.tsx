import React from 'react';
import Fleekon from '@fleekhq/fleekon';
import collection from './selection.json';

export const Icons = {
  search: 'icon-search',
  house: 'icon-house',
  burn: 'icon-burn',
  mint: 'icon-mint',
  transfer: 'icon-transfer',
};

const Icon = ({
  icon,
  size = '18px',
  color = '#000',
  className,
  onClick = () => null,
}: {
  icon: string & typeof Icons,
  size?: string,
  color?: string,
  className: string,
  onClick?: () => void,
}) => (
  <span
    role="presentation"
    onClick={onClick}
  >
    <Fleekon
      collection={collection}
      icon={icon}
      size={size}
      color={color}
      className={className}
    />
  </span>
);

export default Icon;
