import React, { useEffect, useRef } from 'react';
import { styled } from '@stitched';
import ButtonAnimated from '@components/ButtonAnimated';
import { useOutsideHandler } from '@hooks/dom';
import { BookmarkExpandHandler } from '../../App';

export enum BookmarkColumnModes {
  collapsed = 'collapsed',
  expanded = 'expanded'
}

export const isBookmarkColumnModeCollapsed = (mode: BookmarkColumnModes) => mode
=== BookmarkColumnModes.collapsed;

export default {};
