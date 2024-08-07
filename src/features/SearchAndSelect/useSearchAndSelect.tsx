import { useState } from 'react'
import { LeanLineageNode } from '../../types';

const useSearchAndSelect = (initialValue: string, selectCallback: (id?: number) => void) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(initialValue);

  const toggleSearch = () => {
    setIsSearching(prev => !prev)
  }
  
  const toggleDropDown = () => {
    setDropDown(prev => !prev)
  }

  const changeQuery = (value: string) => {
    setQuery(value)
    if (value === "") {
      setDropDown(false)
    } else {
      setDropDown(true)
    }
  }

  const handleSelectItem = (item: {id?: number, name: string}) => {
    selectCallback(item?.id)
    setQuery(item.name)
    setDropDown(false)
  }


  return {isSearching, query, toggleSearch, changeQuery, toggleDropDown, dropDown, handleSelectItem}
}

export default useSearchAndSelect