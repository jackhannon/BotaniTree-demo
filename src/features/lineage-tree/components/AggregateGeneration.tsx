import React, { useRef, useState } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { Individual } from '../../../types';
import LineageTreeStyles from '../styles/LineageTreeStyle.module.css'
import ButtonWithHoverLabel from '../../../components/ButtonWithHoverLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import ItemCard from '../../../components/ItemCard';
import CardStyles from '../../../styles/cardAndListStyles.module.css'
import ItemCardInfo from '../../../components/ItemCardInfo';
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

const AggregateGeneration: React.FC<Props> = ({
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
  const [activeIdOfAggregates, setActiveIdOfAggregates] = useState<number | undefined>();
  const [isHoveringSiblingCounter, setIsHoveringSiblingCounter] = useState<boolean>(false);

  function getActiveNode() {
    return children.find(child => child.id === activeIdOfAggregates);
  }

  function getHoveredNode() {
    return children.find(child => child.id === hoveredNodeId);
  }


  const computeXPositioningInOrder = (childrenCount: number, offset: number) => {
    let positions: number[] = [];
    const center = Math.floor(childrenCount / 2);
    let minOffset = 0;
    if (childrenCount % 2 === 0) {
      minOffset = Math.floor(offset/2);
    }
    let currentOffset = (center * offset) - minOffset;

    while (currentOffset >= -(center * offset) + minOffset) {
      if (childrenCount % 2 === 0 && (currentOffset <= 0 && currentOffset > -minOffset)) {
        currentOffset -= offset;
        continue
      }
      positions.push(currentOffset);
      currentOffset -= offset;
    }
    if (typeof activeIdOfAggregates === "number") {
      positions = positions.map(() => {
        return 0
      });
    }
    return positions
  }

  let computedXPositionsForAggregateNodes = computeXPositioningInOrder(children.length, 44)
  
  const handleAggregateNodeClick = (id: number) => {
    setActiveIdOfAggregates(state => {
      if (typeof activeIdOfAggregates !== "number") {
        return id
      }
      return state
    })
  };


  const handleUnfocusAggregateNode = () => {
    setActiveIdOfAggregates(undefined);
  };

  const handleMouseEnterSiblingCounter = () => {
    setIsHoveringSiblingCounter(true)
  }

  const handleMouseLeaveSiblingCounter = () => {
    setIsHoveringSiblingCounter(false)
  }

  const getActiveOrHoveredNodeIndex = () => {
    const id  = activeIdOfAggregates || hoveredNodeId

    return children.findIndex(child => child.id === id)
  }

  return (
    <motion.li 
      key={`aggregate-${children[0].id}`}
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
      ref={childrenRef} 
      className={`
        ${LineageTreeStyles.child}
        ${isParentBeingHovered ? LineageTreeStyles.parentFocused : ""}
      `}
      style={{ willChange: 'width, opacity' }}
    >
      <div
        className={`${
          typeof activeIdOfAggregates === "number" && !getActiveNode()?.mates[activeMateIndex[0]]?.children?.length 
          ? LineageTreeStyles.hasNoChildren 
          : LineageTreeStyles.parentsContainer
        }`}
        style={{width: `${typeof activeIdOfAggregates === "number" ? 568 : 176 + ((children.length-1) * 44)}px`}}
        onMouseLeave={handleUnHover}
      >
        {children.map((node, index) => {
          return (
            <React.Fragment key={index}>
              <div className={`
                ${LineageTreeStyles.fatherContainer} 
                ${LineageTreeStyles.fatherContainerOfActive} 
                ${activeIdOfAggregates === node.id ? `fadeInElement` : "fadeOutElement"}
                `}
              >
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
                  key={index+node.mates[activeMateIndex[0]]?.id}
                  image={node.mates[activeMateIndex[0]]?.images?.[0]} 
                  id={node.mates[activeMateIndex[0]]?.id} 
                  sizeStyles={CardStyles.smallCardSize} 
                  imageDimensions={{width: 176}} 
                  styles={`${LineageTreeStyles.nodeContent} ${isParentBeingHovered ? LineageTreeStyles.parentFocused : ""}`}
                  handleHover={handleHover}
                  handleUnHover={handleUnHover}
                >
                  <ItemCardInfo
                    id={node.mates[activeMateIndex[0]]?.id}
                    onClick={displayInfoCard} 
                    name={node.mates[activeMateIndex[0]]?.name || "???"}
                  />
                </ItemCard>
              </div>

              <div 
                style={{
                  transform: "translateX(" + computedXPositionsForAggregateNodes[index] + "px)"
                }}
                className={`${LineageTreeStyles.nodeContainer}
                  ${(typeof activeIdOfAggregates === "number" && activeIdOfAggregates !== node.id) ? LineageTreeStyles.shaded: ""}
                  ${isParentBeingHovered || hoveredNodeId === node.id ? LineageTreeStyles.parentFocused: ""}
                  ${typeof activeIdOfAggregates !== "number" ? LineageTreeStyles.aggregateNodeContainer : ""} 
                `}
                onMouseEnter={() => handleHover(node.id)} 
              >
                <ItemCard
                  key={index+node.id}
                  image={node.images[0]} 
                  id={node.id} 
                  handleClick={typeof activeIdOfAggregates !== "number" ? handleAggregateNodeClick : () => {}}
                  sizeStyles={CardStyles.smallCardSize} 
                  imageDimensions={{width: 176}} 
                  styles={`
                    ${LineageTreeStyles.nodeContent} 
                    ${isParentBeingHovered ? LineageTreeStyles.parentFocused : ""} 
                    ${typeof activeIdOfAggregates !== "number" ? LineageTreeStyles.aggregateNode : ""} 
                  `}
                >
                  <>
                    {activeIdOfAggregates === node.id &&
                      <ButtonWithHoverLabel
                        positioningStyles={`${LineageTreeStyles.siblingCounter}`}
                        label={"show siblings"}
                      >
                        <button 
                          className={LineageTreeStyles.expandSiblingsButton}
                          onClick={handleUnfocusAggregateNode} 
                          onMouseEnter={handleMouseEnterSiblingCounter}
                          onMouseLeave={handleMouseLeaveSiblingCounter}
                        >
                          {isHoveringSiblingCounter 
                          ? <FontAwesomeIcon icon={faPlus} className={`fadeInElement`} />
                          : children.length-1}
                        </button>
                      </ButtonWithHoverLabel>
                    }
                    <ItemCardInfo id={node.id} onClick={displayInfoCard} name={node.name || "???"}/>
                  </>
                </ItemCard>
              </div>
              {(activeIdOfAggregates === node.id) && (
                <ButtonWithHoverLabel
                  positioningStyles={getActiveNode()?.mates?.[activeMateIndex[0]]?.children?.length || 0 > 0 ? LineageTreeStyles.addChildPosition : LineageTreeStyles.addFirstChildPosition}
                  label="Add child"
                  ariaLabel={`add-child-of-${node.id}`}
                >
                  <button 
                    className={LineageTreeStyles.addChild}
                    onClick={
                      () => 
                        displayNewInfoCard(
                          node.id,
                          node.mates[activeMateIndex[0]]?.id
                        )
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </ButtonWithHoverLabel>
              )}
            </React.Fragment>
          )}
        )}    
      </div>
      <AnimatePresence>
        {((getHoveredNode()?.mates[activeMateIndex[getActiveOrHoveredNodeIndex()]]?.children?.length || 0) > 0) ||
          ((getActiveNode()?.mates[activeMateIndex[getActiveOrHoveredNodeIndex()]]?.children?.length || 0) > 0) && (
            <LineageGeneration 
              key={`child-${children[0].id}`}
              children={
                getHoveredNode()?.mates[activeMateIndex[getActiveOrHoveredNodeIndex()]]?.children?.length ? 
                getHoveredNode()?.mates[activeMateIndex[getActiveOrHoveredNodeIndex()]].children as Individual[] : 
                getActiveNode()?.mates[activeMateIndex[getActiveOrHoveredNodeIndex()]].children as Individual[]
              }
              isParentBeingHovered={isParentBeingHovered || typeof hoveredNodeId === "number"}
              displayInfoCard={displayInfoCard}
              displayNewInfoCard={displayNewInfoCard}
            />
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default AggregateGeneration