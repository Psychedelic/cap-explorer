import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SizeProp,
} from '@fortawesome/fontawesome-svg-core';
/**
 * When importing new icons
 * use the convention you find in the previous imported icons
 * import { x } from '@fortawesome/xxxx/targetIcon'
 * https://github.com/FortAwesome/Font-Awesome/issues/16005
 */
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { faBookmark } from '@fortawesome/pro-regular-svg-icons/faBookmark';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faHomeAlt } from '@fortawesome/pro-regular-svg-icons/faHomeAlt';
import { faList } from '@fortawesome/pro-regular-svg-icons/faList';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { faClone } from '@fortawesome/pro-regular-svg-icons/faClone';

export const IconNames = [
  'ArrowLeft',
  'ArrowRight',
  'Bookmark',
  'Check',
  'ChevronRight',
  'Clone',
  'HomeAlt',
  'List',
  'Search',
  'Times',
] as const;

export type IconType = typeof IconNames[number]

const getIcon = (icon: IconType) => {
  switch (icon) {
    case 'ArrowLeft':
      return faArrowLeft;
    case 'ArrowRight':
      return faArrowRight;
    case 'Bookmark':
      return faBookmark;
    case 'Clone':
      return faClone;
    case 'Check':
      return faCheck;
    case 'ChevronRight':
      return faChevronRight;
    case 'HomeAlt':
      return faHomeAlt;
    case 'List':
      return faList;
    case 'Search':
      return faSearch;
    case 'Times':
      return faTimes;
    default:
      throw Error(`Oops! The icon ${icon} was not found, check the <Icon> imports`);
  }
};

const Icon = ({
  icon,
  size,
  title,
}: {
  icon: IconType,
  size: SizeProp,
  title: string,
}) => (
  <FontAwesomeIcon
    icon={getIcon(icon)}
    size={size}
    title={title}
  />
);

export default Icon;
