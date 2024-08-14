import { useState, useRef,} from 'react'
import SearchBarStyles from '../styles/searchBarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons'
import ButtonWithHoverLabel from '../../../components/ButtonWithHoverLabel'
import SearchFilters from './SearchFilters'
import { useHeaderContext } from '../../../context/HeaderContext'
import { usePlantContext } from '../../../context/PlantContext'


const SearchBar = () => {
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const {query, countTruthyFilters, changeQuery} = useHeaderContext()
  const {species} = usePlantContext()
  const appliedFilterCount = countTruthyFilters()

  const [filtersVisibility, setFilterVisibility] = useState<boolean>(false);

   const toggleFilters = () => {
    setFilterVisibility(prevState => !prevState)
   }

  return (
  <div 
    className={`${SearchBarStyles.search}`} 
    ref={searchRef}>
        <button className={SearchBarStyles.btn} aria-label='search'>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={SearchBarStyles.searchIcon} />
        </button>
      <input
        ref={inputRef}
        value={query}
        onChange={e => changeQuery(e.target.value)}
        type="text"
        className={SearchBarStyles.input}
        placeholder='search...'
      />
      {typeof species.id === "number" ? (
        <ButtonWithHoverLabel label="filters">
          <button 
            aria-label="filters" 
            className={SearchBarStyles.btn}
            onClick={toggleFilters}
          >
            <FontAwesomeIcon icon={faSliders}/>
          </button>
          {appliedFilterCount > 0
          && 
            <div className={SearchBarStyles.filterCount} onClick={toggleFilters}>
              {appliedFilterCount}
            </div>
          } 
        </ButtonWithHoverLabel>
      ) : (
        <div className={SearchBarStyles.btn}>
        </div>
      )}
    
      {filtersVisibility && <SearchFilters/>}
  </div>
  )
}

export default SearchBar