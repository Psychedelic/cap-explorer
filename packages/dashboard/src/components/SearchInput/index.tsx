/* eslint-disable no-console */
import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import { styled } from '@stitched';
import { useAccountStore } from '@hooks/store';
import { RawLink } from '@components/Link';
import { getRouteByName } from '@utils/routes';
import { useOutsideHandler } from '@hooks/dom';
import Fleekon from '@components/Fleekon';

const SearchAccount = styled('div', {
  position: 'relative',

  '& > div:first-child': {
    height: '48px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '12px 16px',
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
    width: '100%',
    minWidth: '300px',
    boxSizing: 'border-box',
    boxShadow: 'rgb(0 0 0 / 4%) 0px 24px 32px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 0px 1px',

    '& > span svg': {
      opacity: 0.7,
      transition: 'opacity 0.6s',
    },

    '&:hover': {
      '& > span svg': {
        opacity: 1,
      },
    },
  },

  variants: {
    showSuggestions: {
      true: {
        '& > div:first-child': {
          borderRadius: '12px 12px 0px 0px',
        },
      },
      false: {
        '& > div:first-child': {
          borderRadius: '12px',
        },
      },
    },
  },
});

const Input = styled('input', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  background: 'none',
  border: 'none',
  outline: 'none',
  width: '100%',
  color: 'rgb(250, 250, 250)',
  fontSize: '$m',
});

const SuggestionDropbox = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  zIndex: 9999,
  width: '100%',
  top: '50px',
  maxHeight: '540px',
  overflow: 'auto',
  left: '0px',
  paddingBottom: '20px',
  background: 'rgb(0, 0, 0)',
  borderBottomRightRadius: '12px',
  borderBottomLeftRadius: '12px',

  position: 'absolute',
  boxShadow: '1px 1px 20px rgb(0 0 0 / 60%)',
});

const SuggestionItem = styled('div', {
  boxSizing: 'border-box',
  margin: '0px',
  minWidth: '0px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  fontSize: '$s',
  transition: 'background 0.2s',

  '&:hover': {
    cursor: 'pointer',
    backgroundColor: '$darkGrey',
  },
});

const SuggestionMore = styled(SuggestionItem, {
  transition: 'opacity 0.3s',

  '& a': {
    color: '$primaryBlue',
  },

  '&:hover': {
    opacity: 0.8,
    backgroundColor: 'transparent',
  },
});

type Suggestions = string[];

const SearchInput = () => {
  const accountStore = useAccountStore();
  const {
    canisterNameKeyPairedId,
    contractKeyPairedMetadata,
  } = accountStore;
  const refDOM = useRef<HTMLDivElement | undefined>();
  const [userInput, setUserInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestions>([]);
  const clickedOutside = useOutsideHandler({
    domElement: refDOM?.current,
  });
  const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter by name
    // gets a list of names
    const matchesByName =
      Object
        .keys(canisterNameKeyPairedId)
        .filter(
          (val: string) => val.toLowerCase().includes(e.currentTarget.value.trim().toLowerCase())
        );

    // Reverse lookup which computes the name based in the requested id
    // gets a list of names
    const matchesById =
      contractKeyPairedMetadata
      && Object
          .keys(contractKeyPairedMetadata)
          .filter(
            (val: string) => val.toLowerCase().includes(e.currentTarget.value.trim().toLowerCase())
          )
          .map((canisterId: string) => contractKeyPairedMetadata[canisterId].name)
      || [];

    const suggestions = [...new Set([...matchesByName, ...matchesById])];

    setSuggestions(suggestions);
    setUserInput(e.currentTarget.value);
  };

  const showSuggestions = !!(userInput.length && suggestions.length);

  useEffect(() => {
    if (!suggestions.length) return;

    setSuggestions([]);
    setUserInput('');
  }, [clickedOutside]);

  return (
    <SearchAccount
      ref={refDOM as React.RefObject<HTMLDivElement>}
      showSuggestions={showSuggestions}
      data-input-search
    >
      <div>
        <Input
          type="text"
          placeholder="Search by Name or Canister ID..."
          onChange={onInputHandler}
          value={userInput}
        />
        {
          (
            showSuggestions
            && (
              <Fleekon
                icon="cross"
                size="14px"
                className="icon-magnifying-glass"
              />
            )
          )
          || (
            <Fleekon
              icon="magnifyingGlass"
              size="14px"
              className="icon-magnifying-glass"
            />
          )
        }
      </div>
      {
        showSuggestions
        && (
          <SuggestionDropbox data-suggestion-dd>
            {
              suggestions.map((id) => (
                <span
                  key={id}
                  data-suggestion
                  data-suggestion-acc-id
                >
                  <RawLink
                    to={
                      getRouteByName('AppTransactions', {
                        id: canisterNameKeyPairedId[id],
                      })
                    }
                  >
                    <SuggestionItem>
                      { id }
                    </SuggestionItem>
                  </RawLink>
                </span>
              ))
            }
          </SuggestionDropbox>
        )
      }
    </SearchAccount>
  );
};

export default SearchInput;
