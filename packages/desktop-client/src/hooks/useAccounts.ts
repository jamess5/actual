import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { type State } from '../state';
import { getAccounts } from '../state/actions';

export function useAccounts() {
  const dispatch = useDispatch();
  const accountsLoaded = useSelector(
    (state: State) => state.queries.accountsLoaded,
  );

  useEffect(() => {
    if (!accountsLoaded) {
      dispatch(getAccounts());
    }
  }, []);

  return useSelector(state => state.queries.accounts);
}
