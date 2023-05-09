import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSelect } from 'downshift'
import { Selection } from '@/types/tankstellen-types';


type Props = {
  setShowFavList: Dispatch<SetStateAction<boolean>>;
}

function ListSelect({ setShowFavList }: Props) {

  function itemToString(item: Selection | null) {
    return item ? item.value : ''
  }

  const selections: Selection[] = [
    { value: 'Top 10' },
    { value: 'Favorites' }
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
      items: selections,
      itemToString,
    })

    useEffect(() => {
      if (selectedItem !== null && selectedItem?.value === 'Favorites') {
         setShowFavList(true)
      }
      else if(selectedItem !== null && selectedItem?.value === 'Top 10'){
        setShowFavList(false)
      }
    }, [selectedItem])

    return (
      <div>
        <div className="combobox">
          <label {...getLabelProps()}>Select Default List</label>
          <div
            className="input-delete-wrapper select-box"
            {...getToggleButtonProps()}
          >
            <span>{selectedItem ? selectedItem.value : 'Top 10'}</span>
            <span className="">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
          </div>
        </div>
        <ul
          className="combobox__list flow select-items"
          {...getMenuProps()}
        >
          {isOpen &&
            selections.map((item, index) => (
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


export default ListSelect
