import React, { useRef } from 'react'
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
  activeMateIndex: number[]
  hoveredNodeId: number | undefined
  handleHover: (id: number) => void
  handleUnHover: () => void
  getNextParent: (nodePosition?: number) => void
  getPrevParent: (nodePosition?: number) => void
}
const TwoNodeGeneration: React.FC<Props> = ({
  children, 
  isParentBeingHovered=false, 
  displayInfoCard, 
  displayNewInfoCard, 
  activeMateIndex,
  hoveredNodeId,
  handleHover,
  handleUnHover,
  getNextParent,
  getPrevParent
}) => {
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
                duration: 0.3
              },
              opacity: {
                duration: 0.3
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
            ${!node.mates[activeMateIndex[index]]?.children?.length ? LineageTreeStyles.hasNoChildren : LineageTreeStyles.parentsContainer}
            ${isParentBeingHovered || hoveredNodeId === node.id ? LineageTreeStyles.parentFocused : ""}
          `}
          >
            {/* need to maintain width */}
            {((node.mates[activeMateIndex[index]]?.children?.length || 0) > 0) &&
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

            <ButtonWithHoverLabel
              positioningStyles={node.mates[activeMateIndex[index]]?.children?.length ? LineageTreeStyles.addChildPosition : LineageTreeStyles.addFirstChildPosition}
              label="Add child"
              ariaLabel={`add-child-of-${node.id}`}
            >
              <button 
                className={LineageTreeStyles.addChild}
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
          </div>
          <AnimatePresence>
            {node.mates[activeMateIndex[index]]?.children?.length 
            ? <LineageGeneration
                key={(node.mates[activeMateIndex[index]].children?.length || 0) + (children[0].id || 0)}
                children={node.mates[activeMateIndex[index]].children as Individual[]} 
                isParentBeingHovered={isParentBeingHovered || hoveredNodeId === node.id}
                displayInfoCard={displayInfoCard}
                displayNewInfoCard={displayNewInfoCard}
              /> 
            : null}
          </AnimatePresence>
        </motion.li>
      ))}
    </>
  )
}

export default TwoNodeGeneration