import React, { useRef, useState } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { Individual } from '../../../types';
import ItemCardInfo from '../../../components/ItemCardInfo';
import ButtonWithHoverLabel from '../../../components/ButtonWithHoverLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import LineageTreeStyles from '../styles/LineageTreeStyle.module.css'
import ItemCard from '../../../components/ItemCard';
import CardStyles from '../../../styles/cardAndListStyles.module.css'
import LineageGeneration from './LineageGeneration';

type Props = {
  children: Individual[];
  isParentBeingHovered: boolean;
  displayInfoCard: (id: number) => void
  displayNewInfoCard: (mother_id: number, father_id: number) => void
  hoveredNodeId: number | undefined
  handleHover: (id: number) => void
  handleUnHover: () => void
  isPreview?: boolean
}
const TwoNodeGeneration: React.FC<Props> = ({
  children, 
  isParentBeingHovered=false, 
  displayInfoCard, 
  displayNewInfoCard, 
  hoveredNodeId,
  handleHover,
  handleUnHover,
  isPreview
}) => {

  const [activeMateIndex, setActiveMateIndex] = useState<number[]>([0, 0]);

  const getNextParent = (nodePosition: number = 0) => {
    setActiveMateIndex(prevState => {
      const state = [...prevState];
      const numberOfMates = children[nodePosition].mates.length
      state[nodePosition] = (prevState[nodePosition] + 1) % numberOfMates;
      return state;
    });
  }

  const getPrevParent = (nodePosition: number = 0) => {
    setActiveMateIndex(prevState => {
      const state = [...prevState];
      const numberOfMates = children[nodePosition].mates.length
      state[nodePosition] = Math.abs(prevState[nodePosition] - 1) % numberOfMates;
      return state;
    });
  }

  const childrenRef = useRef<HTMLLIElement>(null)
  return (
    <>
      {children.map((node, index) => (
        <motion.li 
          key={`node-${node.id}-${index}`}
          initial={{
            width: 0,
            opacity: 0
          }}
          animate={{
            width: "auto",
            opacity: 1,
            transition: {
              width: {
                duration: 0.3,
                delay: 0.3
              },
              opacity: {
                duration: 0.3,
                delay: 0.3
              }
            }
          }}
          exit={{
            width: 0,
            opacity: 0,
            transition: {
              width: {
                duration: 0.3
              },
              opacity: {
                duration: 0.3
              }
            }
          }}
          className={`${LineageTreeStyles.child} fadeInElement`} 
          style={{ willChange: 'width, opacity' }}
          ref={childrenRef}
        >
          <div className={`
            ${
              isPreview
              ? LineageTreeStyles.previewNode
              : (!node.mates[activeMateIndex[index]]?.children?.length) 
              ? LineageTreeStyles.hasNoChildren 
              : LineageTreeStyles.parentsContainer
            }
            ${isParentBeingHovered || hoveredNodeId === node.id ? LineageTreeStyles.parentFocused : ""}
          `}
          >
          
            {/* need to maintain width */}
            {(((node.mates[activeMateIndex[index]]?.children?.length || 0) > 0) && !isPreview) &&
              <span className={`${LineageTreeStyles.pseudoContainer}`}>
              </span>
            }

            <ItemCard
              key={`child-${node.id}-${index}`}
              image={node.images[0]} 
              id={node.id} 
              sizeStyles={CardStyles.smallCardSize} 
              imageDimensions={{width: 176}} 
              styles={`${LineageTreeStyles.nodeContent} ${isParentBeingHovered ? LineageTreeStyles.parentFocused : ""}`}
              handleHover={handleHover}
              handleUnHover={handleUnHover}
            >
              <ItemCardInfo id={node.id} onClick={displayInfoCard} name={node.name}/>
            </ItemCard>
            
            {!isPreview && (
              <>
                <ButtonWithHoverLabel
                  positioningStyles={node.mates[activeMateIndex[index]]?.children?.length ? LineageTreeStyles.addChildPosition : LineageTreeStyles.addFirstChildPosition}
                  label="Add child"
                >
                  <button 
                    className={LineageTreeStyles.addChild}
                    aria-label={`add-child-of-${node.id}`}
                    onClick={() => displayNewInfoCard(
                      node.id,
                      node.mates[activeMateIndex[index]]?.id
                    )}
                    >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </ButtonWithHoverLabel>
                
                {(node.mates[activeMateIndex[index]]?.children?.length || 0 > 0) &&
                  <span className={`${LineageTreeStyles.fatherContainer} ${`fadeInElement`}`}>
                    {node.mates.length > 1 && (
                      <div className={LineageTreeStyles.paginateMatesContainer}>
                        <ButtonWithHoverLabel label="Next Mate">
                          <button onClick={() => getNextParent(index)}><FontAwesomeIcon icon={faChevronUp} /></button>
                        </ButtonWithHoverLabel>
                        <ButtonWithHoverLabel label="Previous Mate">
                          <button onClick={() => getPrevParent(index)}><FontAwesomeIcon icon={faChevronDown} /></button>
                        </ButtonWithHoverLabel>
                      </div>
                    )}

                    <ItemCard 
                      image={node?.mates[activeMateIndex[index]]?.images?.[0]} 
                      id={node.mates[activeMateIndex[index]]?.id}
                      sizeStyles={CardStyles.smallCardSize} 
                      imageDimensions={{width: 176}} 
                      styles={`${LineageTreeStyles.nodeContent} ${isParentBeingHovered ? LineageTreeStyles.parentFocused : ""}`}
                    >
                      <ItemCardInfo id={node.mates[activeMateIndex[index]]?.id} onClick={displayInfoCard} name={node.mates[activeMateIndex[index]]?.name || "???"}/>
                    </ItemCard>
                  </span>
                }
              </>
            )}
          </div>
          <AnimatePresence>
            {(node.mates[activeMateIndex[index]]?.children?.length && !isPreview) && 
              <LineageGeneration
                key={`${children[0].id}-${activeMateIndex}`}
                children={node.mates[activeMateIndex[index]].children as Individual[]} 
                isParentBeingHovered={isParentBeingHovered || hoveredNodeId === node.id}
                displayInfoCard={displayInfoCard}
                displayNewInfoCard={displayNewInfoCard}
              /> 
            }
          </AnimatePresence>
        </motion.li>
      ))}
    </>
  )
}

export default TwoNodeGeneration