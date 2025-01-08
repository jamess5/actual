import { useCallback } from 'react';

import { savePrefs } from 'loot-core/client/actions';
import { type MetadataPrefs } from 'loot-core/types/prefs';

import { useAppSelector, useAppDispatch } from '../redux';

type SetMetadataPrefAction<K extends keyof MetadataPrefs> = (
  value: MetadataPrefs[K],
) => void;

export function useMetadataPref<K extends keyof MetadataPrefs>(
  prefName: K,
): [MetadataPrefs[K], SetMetadataPrefAction<K>] {
  const dispatch = useAppDispatch();
  const setLocalPref = useCallback<SetMetadataPrefAction<K>>(
    value => {
      dispatch(savePrefs({ [prefName]: value }));
    },
    [prefName, dispatch],
  );
  const localPref = useAppSelector(state => state.prefs.local?.[prefName]);

  return [localPref, setLocalPref];
}
