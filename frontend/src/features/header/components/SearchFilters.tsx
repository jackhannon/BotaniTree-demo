import SearchBarStyles from '../styles/searchBarStyles.module.css'
import SearchAndSelect from '../../SearchAndSelect/SearchAndSelect';
import useSearchAndSelect from '../../SearchAndSelect/useSearchAndSelect';
import { FilterObjectEntry, Filters } from '../../../types';
import { useHeaderContext } from '../../../context/HeaderContext';
import { usePlantContext } from '../../../context/PlantContext';


const SearchFilters = () => {
  
  const {filters, changeFilters} = useHeaderContext()

  const {getCurrentPlant, getQueriedPlants} = usePlantContext()

  const handleFilterChange = (fieldOfFilters: FilterObjectEntry<Filters>) => {
    changeFilters(fieldOfFilters)
  };


  const changeMother = (id: number) => {
    const plant = getCurrentPlant(id)
    handleFilterChange({mother: {mother_id: id, motherName: plant?.name}})
  }

  const changeFather = (id: number) => {
    const plant = getCurrentPlant(id)
    handleFilterChange({father: {father_id: id, fatherName: plant?.name}})
  }
  
  const {
    query: motherQuery, 
    changeQuery: changeMotherQuery, 
    toggleDropDown: toggleMotherDropDown,
    dropDown: motherDropDown,
    handleSelectItem: handleSelectMother
  } = useSearchAndSelect(filters.mother.motherName || "", changeMother)

  const {
    query: fatherQuery, 
    changeQuery: changeFatherQuery, 
    toggleDropDown: toggleFatherDropDown, 
    dropDown: fatherDropDown,
    handleSelectItem: handleSelectFather
  } = useSearchAndSelect(filters.father.fatherName || "", changeFather)

  const motherQueryResults = getQueriedPlants(motherQuery)
  const fatherQueryResults = getQueriedPlants(fatherQuery)
  // const [motherQueryResults, setMotherQueryResults] = useState(getQueriedPlants(motherQuery))

  return (
    <div className={SearchBarStyles.filters}>
      <div className={SearchBarStyles.checkboxFilters}>
        <div>
          <input type={"checkbox"} id={"clone"} value={filters.isClone ? 1 : 0} onChange={() => handleFilterChange({isClone: !filters.isClone})}/>
          <label htmlFor={"clone"}>Clone</label>
        </div>
        <div>
          <input type={"checkbox"} id={"artificial-conditions"} value={filters.hasArtificialConditions ? 1 : 0} onChange={() => handleFilterChange({hasArtificialConditions: !filters.hasArtificialConditions})}/>
          <label htmlFor={"artificial-conditions"}>Artificial conditions</label>
        </div>
        <div>
          <input type={"checkbox"} id={"dead"} value={filters.isDead ? 1 : 0} onChange={() => handleFilterChange({isDead: !filters.isDead})}/>
          <label htmlFor={"dead"}>Dead</label>
        </div>
        <div>
          <input type={"checkbox"} id={"needs water"} value={filters.needsWater ? 1 : 0} onChange={() => handleFilterChange({hasArtificialConditions: !filters.needsWater})}/>
          <label htmlFor={"needs-water"}>Needs water</label>
        </div>
        <div>
          <input type={"checkbox"} id={"needs-fertilizer"} value={filters.needsFertilizer ? 1 : 0} onChange={() => handleFilterChange({hasArtificialConditions: !filters.needsFertilizer})}/>
          <label htmlFor={"needs-fertilizer"}>Needs fertilizer</label>
        </div>
      </div>

      <div className={SearchBarStyles.textInputFilters}> 
        <div className={SearchBarStyles.descendentFilter}>
          Descendent of: 
          <div className={SearchBarStyles.inputs}> 
            <SearchAndSelect 
              placeholder={'search parent'} 
              data={motherQueryResults} 
              handleChangeQuery={changeMotherQuery} 
              toggleDropDown={toggleMotherDropDown} 
              dropDownState={motherDropDown} 
              query={motherQuery} 
              handleChangeSelected={handleSelectMother}
              styles={SearchBarStyles.filterSearchDivInput}
            />
            and
            <SearchAndSelect 
              placeholder={'search parent'} 
              data={fatherQueryResults} 
              handleChangeQuery={changeFatherQuery} 
              toggleDropDown={toggleFatherDropDown} 
              dropDownState={fatherDropDown} 
              query={fatherQuery} 
              handleChangeSelected={handleSelectFather}
              styles={SearchBarStyles.filterSearchDivInput}
            />
          </div>
        </div>

        <div className={SearchBarStyles.descendentFilter}>
          Water Frequency Range: 
          <div className={SearchBarStyles.inputs}> 
            <input
              className={SearchBarStyles.filterSearchInput}
              type="number"
              min={0}
              step={0.1}
              placeholder='min frequency'
              value={filters.waterRange.minWater}
              onChange={(e) => handleFilterChange({waterRange: {...filters.waterRange, minWater: e.target.value === "" ? "" : Number(e.target.value)}})}
            />
             and
            <input
              className={SearchBarStyles.filterSearchInput}
              type="number"
              min={0}
              step={0.1}
              placeholder='max frequency'
              value={filters.waterRange.maxWater}
              onChange={(e) => handleFilterChange({waterRange: {...filters.waterRange, maxWater: e.target.value === "" ? "" : Number(e.target.value)}})}
            />
          </div>
        </div>
      </div>

      <div className={SearchBarStyles.textInputFilters} id={SearchBarStyles.ageAndLightFilter}> 
        <div className={SearchBarStyles.descendentFilter}>
          Age Range: 
          <div className={SearchBarStyles.inputs}> 
            <input
              className={SearchBarStyles.filterSearchInput}
              type="number"
              min={0}
              step={0.1}
              placeholder='min years'
              value={filters.ageRange.minAge}
              onChange={(e) => handleFilterChange({ageRange: {...filters.ageRange, minAge: e.target.value === "" ? "" : Number(e.target.value)}})}
            />
            and
            <input
              className={SearchBarStyles.filterSearchInput}
              type="number"
              min={0}
              step={0.1}
              placeholder='max years'
              value={filters.ageRange.maxAge}
              onChange={(e) => handleFilterChange({ageRange: {...filters.ageRange, maxAge: e.target.value === "" ? "" : Number(e.target.value)}})}
            />
          </div>
        </div>

        <div className={SearchBarStyles.descendentFilter}>
          Peak Hours of Light Range: 
          <div className={SearchBarStyles.inputs}> 
            <input
              className={SearchBarStyles.filterSearchInput}
              type="number"
              min={0}
              placeholder='max hours'
              value={filters.lightRange.minLight}
              onChange={(e) => handleFilterChange({lightRange: {...filters.lightRange, minLight: e.target.value === "" ? "" : Number(e.target.value)}})}
            />
             and
            <input
              className={SearchBarStyles.filterSearchInput}
              type="number"
              min={0}
              placeholder='min hours'
              value={filters.lightRange.maxLight}
              onChange={(e) => handleFilterChange({lightRange: {...filters.lightRange, maxLight: e.target.value === "" ? "" : Number(e.target.value)}})}
            />
          </div>
        </div>
      </div>
    </div>

  )
}

export default SearchFilters