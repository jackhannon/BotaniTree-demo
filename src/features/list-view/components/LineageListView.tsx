import CardStyles from '../../../styles/cardAndListStyles.module.css'
import ListView from '../../../components/ListView'
import ItemCard from '../../../components/ItemCard'
import ItemCardInfo from '../../../components/ItemCardInfo'
import { usePlantContext } from '../../../context/PlantContext'
import { useHeaderContext } from '../../../context/HeaderContext'
import { Individual } from '../../../types'
import { useInfoCardContext } from '../../../context/InfoCardContext'

const LineageListView = () => {
  const {getFlatFilteredPlants} = usePlantContext()
  const {getQueryParams} = useHeaderContext()
  const {toggleInfoCardOn} = useInfoCardContext()

  const filtersQueryParams = getQueryParams()

  // const [flatFilteredResults, setFlatFilteredResults] = useState(getFlatFilteredPlants(filtersQueryParams));
  const flatFilteredResults = getFlatFilteredPlants(filtersQueryParams);
  
  const handleIndividualClick = (id: number) => {
    toggleInfoCardOn({catagory: "plant", itemId: id})
  }

  return (
    <ListView catagory='plant' styles={CardStyles.individualsListContainer} sizeStyles={CardStyles.smallCardSize}>
      {flatFilteredResults.map((item: Individual, index: number) => (
        <ItemCard 
          key={index + String(item.id)} 
          handleClick={(id: number) => handleIndividualClick(id)} 
          id={item.id} image={item.images[0]} 
          imageDimensions={{width: 176}} 
          sizeStyles={CardStyles.smallCardSize}
        >
          <ItemCardInfo name={item.name}/>
        </ItemCard>
      ))}
    </ListView>
  )
}

export default LineageListView