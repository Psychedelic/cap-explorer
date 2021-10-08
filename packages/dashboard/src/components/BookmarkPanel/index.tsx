import React, { useEffect, useRef } from 'react';
import { styled } from '@stitched';
import SavedAccounts from '@components/SavedAccounts';
import ButtonAnimated from '@components/ButtonAnimated';
import Icon from '@components/Icon';
import { useOutsideHandler } from '@hooks/dom';
import { BookmarkExpandHandler } from '../../App';

export enum BookmarkColumnModes {
  collapsed = 'collapsed',
  expanded = 'expanded'
}

export const isBookmarkColumnModeCollapsed = (mode: BookmarkColumnModes) => mode
=== BookmarkColumnModes.collapsed;

const Container = styled('div', {
  fontFamily: 'Inter',
  fontWeight: 'normal',
  fontSize: '$s',
  display: 'block',
  height: '100%',

  variants: {
    mode: {
      collapsed: {

      },
      expanded: {
        justifyContent: 'flex-start',
        padding: '20px',
        width: '100%',

        '& > button': {
          display: 'flex',
          width: '100%',
          textAlign: 'left',
        },

        '& hr': {
          border: '1px solid $borderGrey',
          margin: '20px 0px',
        },

        '& svg': {
          height: '16px',
        },
      },
    },
  },
});

const SavedBox = styled('span', {
  padding: '0 0 0 10px',
  fontWeight: 'normal',
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  fontSize: '$s',
  '& > svg': {
    opacity: 1,
    transition: 'opacity 0.2s ease-in, transform 0.2s ease-out',
    transform: 'translateX(-3px)',
  },

  '&:hover > svg': {
    opacity: 0.6,
    transform: 'translateX(0px)',
  },
});

interface BookmarkPanelProps {
  bookmarkExpandHandler: BookmarkExpandHandler,
  mode: BookmarkColumnModes,
}

const BookmarkPanel = ({ bookmarkExpandHandler, mode }: BookmarkPanelProps) => {
  const isExpanded = !isBookmarkColumnModeCollapsed(mode);
  const refDOM = useRef<HTMLDivElement | undefined>();
  const clickedOutside = useOutsideHandler({
    domElement: refDOM?.current,
  });

  useEffect(() => {
    if (!isExpanded) return;

    bookmarkExpandHandler({
      isCollapsed: false,
    });
  }, [clickedOutside]);

  return (
    <Container
      mode={mode}
      data-id="bookmark-panel"
      ref={refDOM as React.RefObject<HTMLDivElement>}
    >
      <ButtonAnimated
        type="button"
        onClick={() => bookmarkExpandHandler()}
        disableAnimation={isExpanded}
      >
        <Icon
          icon="Bookmark"
          size="lg"
          title="Bookmark panel"
        />
        {
          isExpanded && (
            <>
              <SavedBox
                data-saved-box
              >
                <span>Saved</span>
                <Icon
                  icon="ChevronRight"
                  size="lg"
                  title="Collapse bookmark panel"
                />
              </SavedBox>
            </>
          )
        }
      </ButtonAnimated>
      {
        isExpanded && (
          <>
            <hr />
            <SavedAccounts />
          </>
        )
      }
    </Container>
  );
};

export default BookmarkPanel;
