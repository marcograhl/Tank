'use client';
import axios from 'redaxios';
import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { LatLng,Suggestion } from '@/types/tankstellen-types';

type Props = {
  setUserLocation: Dispatch<SetStateAction<LatLng | null>>;
};

export default function LocationSearch({ setUserLocation }: Props) {
  const [term, setTerm] = useState('');
  /* 1. Erschafft einen Typ Suggestion, der zur Rückgabe von /api/locations passt */
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  /* 2. Nutzt den useDebouncedValue-Hook, um debouncedTerm zu erstellen. */
  const debouncedTerm = useDebouncedValue(term, 600);
  /* 3. useEffect, axios und debouncedTerm nutzen, um Schnittstelle
  anzufragen und das Ergebnis in suggestions zu speichern. Prüft,
  ob mindestens zwei Zeichen eingegeben wurden. */

  useEffect(() => {
    if (debouncedTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    async function fetchSuggestions() {
      try {
        const { data } = await axios<Suggestion[]>('/api/locations', {
          params: {
            search: debouncedTerm,
          },
        });

        setSuggestions(data);
      } catch (e) {
        console.log(e);
      }
    }

    fetchSuggestions();
  }, [debouncedTerm]);

  function handleSelection(selection: UseComboboxStateChange<Suggestion>) {
    const selectedSuggestion = selection.selectedItem;

    if (selectedSuggestion) {
      /* 1. Übergebt setUserLocation in die LocationSearch-Komponente als Prop.
         2. Wandelt die Daten in selectedSuggestion so um, dass ihr sie in setUserLocation
         geben könnt.
         */

      setUserLocation({
        lat: Number(selectedSuggestion.latitude),
        lng: Number(selectedSuggestion.longitude),
      });
    }
  }

  const {
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    isOpen,
    highlightedIndex,
    reset
  } = useCombobox({
    items: suggestions, // Suchvorschläge
    // Wird bei Texteingabe aufgerufen
    onInputValueChange: (inputData) => setTerm(inputData.inputValue ?? ''),
    itemToString, // Wandelt ausgewähltes Objekt in String um
    // Wird aufgerufen, wenn das ausgewählte Objekt sich ändert
    onSelectedItemChange: handleSelection,
  });



  function clearSearch() {
    setTerm('');
    reset();
    setUserLocation(null);
  }

  return (
    <>
      <div className="combobox">
        <label
          className="text-primary"
          htmlFor="location-search"
          id="downshift-0-label"
          {...getLabelProps()}
        >
          Ort oder Postleitzahl
        </label>
        <div className="input-delete-wrapper">
          <input
            className="combobox__input"
            id="location-search"
            {...getInputProps()}
          />
          <button onClick={clearSearch}>↩️</button>
        </div>
        <ul className="combobox__list" {...getMenuProps()}>
          {isOpen &&
            suggestions.map((suggestion, index) => (
              <li
                key={
                  suggestion.place + suggestion.zipcode + suggestion.latitude
                }
                {...getItemProps({ item: suggestion, index })}
                className={`combobox__item ${index === highlightedIndex
                    ? 'combobox__item--highlighted'
                    : ''
                  }`}
              >
                {suggestion.zipcode} {suggestion.place}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

/* Wandelt das ausgewählte Item in einen String um,
der dann im Input-Element erscheint. */
function itemToString(item: Suggestion | null) {
  return item?.place ?? '';
}




