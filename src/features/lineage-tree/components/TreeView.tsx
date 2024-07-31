import LineageTreeStyles from '../styles/LineageTreeStyle.module.css'
import LineageGeneration from './LineageGeneration'
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../../../App.css'
import { usePlantContext } from '../../../context/PlantContext'
import { useInfoCardContext } from '../../../context/InfoCardContext'



const TreeView: React.FC = () => {
  const {getNestedPlants} = usePlantContext()
  const {toggleInfoCardOn} = useInfoCardContext()
  const root = getNestedPlants()

  const displayInfoCard = (id: number) => {
    toggleInfoCardOn({itemId: id, catagory: "plant"})
  }

  const displayNewInfoCard = (mother_id?:number, father_id?:number) => {
   toggleInfoCardOn({mother_id, father_id, catagory: "plant", isInfoCardNewOrEditing: true})
  }

  return (
    <>
      {typeof root[0]?.id === "number"
      ? 
      <TransformWrapper
        initialScale={1}
        maxScale={2}
        minScale={.7}
        centerOnInit={true}
        centerZoomedOut={false}
        minPositionX={-1000}
        maxPositionX={1000}
      >
        <TransformComponent 
          wrapperClass={LineageTreeStyles.panContainer} 
          contentClass={LineageTreeStyles.treeContainer}
        >
          <LineageGeneration 
            children={root} 
            key={"root"}
            displayInfoCard={displayInfoCard} 
            displayNewInfoCard={displayNewInfoCard}
          />
        </TransformComponent>
      </TransformWrapper>
     
      :  
      <div className={LineageTreeStyles.emptyTreeContainer}>
        <div>
          <div>No plants found!</div>
          <button onClick={() => displayNewInfoCard()} aria-label="add-new-item">
            <FontAwesomeIcon icon={faPlus} />
            Create a root plant
          </button>
        </div>
      </div>
      }
    </>
  )
}

export default TreeView