import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import SearchAndSelectStyles from './searchAndSelectStyles.module.css'


type Props = {
  data: {id: number, name: string}[],
  handleChangeQuery: (value: string) => void,
  query: string,
  handleChangeSelected: (item: {id?: number, name: string}) => void,
  toggleDropDown: () => void,
  dropDownState: boolean
  placeholder?: string
  styles?: string
}
const SearchAndSelect:React.FC<Props> = ({data, handleChangeQuery, query, handleChangeSelected, toggleDropDown, dropDownState, placeholder, styles}) => {
  const [hoveredResultIndex, setHoveredResultIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (dropDownState) {
      if (e.key === 'ArrowUp') {
        setHoveredResultIndex(prevIndex => {
          if (prevIndex === 0) {
           return prevIndex
          } else {
            return prevIndex - 1
          }
        })
      }
      else if (e.key === 'ArrowDown') {
        setHoveredResultIndex(prevIndex => {
          if (prevIndex+1 >= data.length) {
            return prevIndex
          } else {
            return prevIndex + 1
          }
        })
      }
    }
  };

  return (
  <div className={`${SearchAndSelectStyles.selectionContainer} ${styles}`} tabIndex={0} onKeyDown={(e) => handleKeyDown(e)}>
    <div className={SearchAndSelectStyles.selectionControls}>
      <input
        className={SearchAndSelectStyles.input}
        onChange={(e)=> handleChangeQuery(e.target.value)}
        type='text'
        placeholder={placeholder}
        value={query}
      />
      <button className={SearchAndSelectStyles.dropDownButton} onClick={toggleDropDown}>
        <FontAwesomeIcon icon={dropDownState ? faChevronDown : faChevronRight}/>
      </button>
    </div>
    {dropDownState &&
      <ul className={SearchAndSelectStyles.resultContainer}>
        {data?.length && query ? (
          <>
            <li 
              className={hoveredResultIndex === -1 ? SearchAndSelectStyles.activeResult : ""} 
              data-id={-1} 
              onClick={() => handleChangeSelected({id: undefined, name: ""})}
            >
              {"No parent"}
            </li>
            {data.map((element, index)=>
              <li 
                className={hoveredResultIndex === index ? SearchAndSelectStyles.activeResult : ""} 
                data-id={element.id} 
                onClick={() => handleChangeSelected({id: element.id, name: element.name})}
              >
                {element.name}
              </li>
            )}
          </>
        ) : (
          <li>No Results!</li>
        )}
      </ul>
    }
  </div>
  )
}

export default SearchAndSelect