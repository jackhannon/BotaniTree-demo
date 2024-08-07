import React from 'react'
import LineageTreeStyles from '../../lineage-tree/styles/LineageTreeStyle.module.css'
import MiniLineageTreeStyles from '../styles/MiniLineageTreeStyles.module.css'
import EditableTreeNode from '../../../components/EditableItemCardInfo'
import ItemCard from '../../../components/ItemCard'
import CardStyles from '../../../styles/cardAndListStyles.module.css'
import ItemCardInfo from '../../../components/ItemCardInfo'
import { useInfoCardContext } from '../../../context/InfoCardContext'
import { usePlantContext } from '../../../context/PlantContext'
type Props = {
  motherId?: number
  fatherId?: number
  child: {
    id: number,
    name: string,
    image: string
  }
  
  handleChangeMotherId: (motherId?: number) => void
  handleChangeFatherId: (fatherId?: number) => void

}

const MiniLineageTree:React.FC<Props> = ({motherId, fatherId, child, handleChangeFatherId, handleChangeMotherId}) => {
  const {toggleInfoCardOn, isInfoCardNewOrEditing} = useInfoCardContext();
  const {getCurrentPlant} = usePlantContext();
  
  const displayInfoCard = (id?: number) => {
    toggleInfoCardOn({catagory: "plant", itemId: id, isInfoCardNewOrEditing: typeof id !== "number" })
  }

  const mother = getCurrentPlant(motherId)
  const father = getCurrentPlant(fatherId)
  console.log(mother, father)
  return (
    <div className={MiniLineageTreeStyles.microTreeContainer}>
      <ul className={MiniLineageTreeStyles.subUlContainer}>
        <li className={MiniLineageTreeStyles.subLiContainer}>
          <div className={MiniLineageTreeStyles.parentsContainer}>
            <ItemCard
              image={mother?.images[0]} 
              id={motherId} 
              imageDimensions={{width: 176}}
              sizeStyles={CardStyles.smallCardSize}
            >
              {isInfoCardNewOrEditing 
              ? <EditableTreeNode key={mother ? mother.id : 0} name={mother?.name || "???"} handleChangeNode={handleChangeMotherId}/>
              : <ItemCardInfo key={mother ? mother.id : 0} name={mother?.name || "???"} onClick={() => displayInfoCard(mother?.id)}/>
              }            
            </ItemCard>

            <div className={`${LineageTreeStyles.fatherContainer} fadeInElement`}>
              <ItemCard 
                image={father?.images[0]} 
                id={fatherId} 
                imageDimensions={{width: 176}}
                sizeStyles={CardStyles.smallCardSize}
              >
                {isInfoCardNewOrEditing 
                ? <EditableTreeNode key={father ? father.id : 0} name={father?.name || "???"} handleChangeNode={handleChangeFatherId}/>
                : <ItemCardInfo key={father ? father.id : 0} name={father?.name || "???"} onClick={() => displayInfoCard(father?.id)}/>
                }
              </ItemCard>
            </div>
          </div>
          <ul className={MiniLineageTreeStyles.subUlContainer}>
            <li className={MiniLineageTreeStyles.subLiContainer}>
              <ItemCard
                handleClick={typeof child?.id === "number" ? () => displayInfoCard(child.id) : () => {}} 
                image={child.image} 
                id={child?.id}
                imageDimensions={{width: 176}}
                sizeStyles={CardStyles.smallCardSize}
              >
                <ItemCardInfo name={child?.name || "???"}/>
              </ItemCard>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default MiniLineageTree