import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@stitched';
import { useOutsideHandler } from '@hooks/dom';
import { TableId } from '@components/Tables/DataTable';
import Fleekon from '@components/Fleekon';

const Wrapper = styled('div', {
  zIndex: 20,
  position: 'relative',
  minWidth: '110px',
  borderRadius: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'none',
  fontFamily: 'Inter',
  color: '$defaultTxtColour',

  '& > div': {
    backgroundColor: '$darkGrey',
  },

  '& .arrow-down': {
    transform: 'rotate(-45deg)',
  },

  variants: {
    show: {
      true: {
        display: 'flex',
      },
    },
  },
});

const Dropdown = styled('div', {
  position: 'absolute',
  top: '42px',
  paddingTop: '40px',
  width: '100%',
  border: '1px solid rgba(0, 0, 0, 0.15)',
  padding: '10px 10px',
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '1rem',
});

const AutoColumn = styled('div', {
  display: 'grid',
  gridAutoRows: 'auto',
  gridRowGap: '10px',
  justifyItems: 'flex-start',
});

const Row = styled('div', {
  width: '100%',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  textTransform: 'capitalize',
  fontSize: '$s',

  variants: {
    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      spaceBetween: {
        justifyContent: 'space-between',
      },
    },
  },
});

const DropDownController = styled(Row, {
  padding: '4px 6px 4px 10px',
  border: '1px solid transparent',
  borderRadius: '8px',
  height: '40px',

  variants: {
    showBorders: {
      true: {
        border: '1px solid #000',
      },
    },
  },
});

const TableDropDownSelect = <T extends string>({
  show,
  title,
  options,
  onSelectHandler,
  id,
}: {
  show: boolean,
  title: string,
  options: T[],
  onSelectHandler: (option: T) => void,
  id: TableId,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const refDOM = useRef<HTMLDivElement | undefined>();
  const clickedOutside = useOutsideHandler({
    domElement: refDOM?.current,
  });

  const showDropdownHandler = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    setShowDropdown(false);
  }, [clickedOutside]);

  const onOptionClickHandler = (option: T) => {
    setSelectedOption(option);
    onSelectHandler(option);
    setShowDropdown(false);
  };

  return (
    <Wrapper
      ref={refDOM as React.RefObject<HTMLDivElement>}
      show={show}
      data-id={id}
    >
      <DropDownController
        justify="spaceBetween"
        onClick={showDropdownHandler}
        showBorders={showDropdown}
        data-dd-ctrlr
      >
        {selectedOption}
        {/* TODO: style the arrow in table drop down mobile correctly */}
        <Fleekon
          icon="arrowRight"
          className="arrow arrow-down"
          size="13px"
        />
      </DropDownController>

      {showDropdown && (
        <Dropdown
          data-dd
        >
          <AutoColumn>
            {
              options.map((option: T, key) => (
                <Row
                  // eslint-disable-next-line react/no-array-index-key
                  key={key}
                  justify="start"
                  onClick={() => onOptionClickHandler(option)}
                  data-option={option}
                >
                  {option}
                </Row>
              ))
            }
          </AutoColumn>
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default TableDropDownSelect;
