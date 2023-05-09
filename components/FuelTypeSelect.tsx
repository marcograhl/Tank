
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSelect } from 'downshift'
import { Selection } from '@/types/tankstellen-types';
import { Gastype } from '@/types/tankstellen-types';

type Props = {
  setGasType: Dispatch<SetStateAction<Gastype>> 
  gasType: Gastype
}

function FuelSelect({ setGasType, gasType }: Props) {

  function itemToString(item: Selection | null) {
    return item ? item.value : ''
  }

  const FuelTypeSelections: Selection[] = [
    { value: 'e5' },
    { value: 'e10' },
    { value: 'diesel' }
  ]

  function Select() {
    const {
      isOpen,
      selectedItem,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      highlightedIndex,
      getItemProps,
    } = useSelect({
      items: FuelTypeSelections,
      itemToString,
    })

    useEffect(() => {
      if (selectedItem !== null) {
        setGasType(selectedItem.value as Gastype)
      }

    }, [selectedItem])

    return (
      <div>
        <div className="combobox">
          <label {...getLabelProps()}>Select Fueltype</label>
          <div
            className="input-delete-wrapper select-box"
            {...getToggleButtonProps()}
          >
            <span>{selectedItem ? selectedItem.value : gasType}</span>
            <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
          </div>
        </div>
        <ul
          className="combobox__list flow select-items"
          {...getMenuProps()}
        >
          {isOpen &&
            FuelTypeSelections.map((item, index) => (
              <li
                    className={`combobox__item ${index === highlightedIndex
                    ? 'combobox__item--highlighted'
                    : ''
                  }`}
  key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <span>{item.value}</span>
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return <Select />
}


export default FuelSelect
