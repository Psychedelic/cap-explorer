import React from 'react';
import Fleekon from '@fleekhq/fleekon';
import collection from './selection.json';

const Icons = {
  clone: 'icon-clone',
  check: 'icon-check',
  search: 'icon-search',
  house: 'icon-house',
  burn: 'icon-burn',
  mint: 'icon-mint',
  transfer: 'icon-transfer',
};

export type IconNames = keyof typeof Icons;

const Icon = ({
  icon,
  size = '18px',
  color = '#000',
  className,
  onClick = () => null,
}: {
  icon: IconNames,
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
      icon={Icons[icon]}
      size={size}
      color={color}
      className={className}
    />
  </span>
);

export default Icon;
