import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSelect } from 'downshift'
import { Selection } from '@/types/tankstellen-types';


type Props = {
  setShowFavList: Dispatch<SetStateAction<boolean>>;
}

function ListSelect({ setShowFavList }: Props) {

  function itemToString(item: Selection | null) {
    return item ? item.title : ''
  }

  const selections: Selection[] = [
    { title: 'Top 15' },
    { title: 'Favorites' }
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
      if (selectedItem !== null && selectedItem?.title === 'Favorites') {
         setShowFavList(true)
      }
      else if(selectedItem !== null && selectedItem?.title=== 'Top 15'){
        setShowFavList(false)
      }

      console.log(selectedItem)

    }, [selectedItem])

    return (
      <div>
        <div className="w-72 flex flex-col gap-1">
          <label {...getLabelProps()}>Select Default List</label>
          <div
            className="p-2 bg-white flex justify-between cursor-pointer"
            {...getToggleButtonProps()}
          >
            <span>{selectedItem ? selectedItem.title : 'Top 15'}</span>
            <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
          </div>
        </div>
        <ul
          className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 ${!isOpen && 'hidden'
            }`}
          {...getMenuProps()}
        >
          {isOpen &&
            selections.map((item, index) => (
              <li
                className={`hi`}
                key={`${item.title}${index}`}
                {...getItemProps({ item, index })}
              >
                <span>{item.title}</span>
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return <Select />
}


export default ListSelect
