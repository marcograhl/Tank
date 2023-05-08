
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
        setGasType(selectedItem.value)
      }

    }, [selectedItem])

    return (
      <div>
        <div className="w-72 flex flex-col gap-1">
          <label {...getLabelProps()}>Select Fueltype</label>
          <div
            className="p-2 bg-white flex justify-between cursor-pointer"
            {...getToggleButtonProps()}
          >
            <span>{selectedItem ? selectedItem.value : gasType}</span>
            <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
          </div>
        </div>
        <ul
          className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 ${!isOpen && 'hidden'
            }`}
          {...getMenuProps()}
        >
          {isOpen &&
            FuelTypeSelections.map((item, index) => (
              <li
                className={`hi`}
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
