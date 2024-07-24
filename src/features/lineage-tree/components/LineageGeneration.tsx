import React, { useRef, useState } from "react";
import LineageTreeStyles from '../styles/LineageTreeStyle.module.css'
import CardStyles from '../../../styles/cardAndListStyles.module.css'
import { Individual } from "../../../types";
import ButtonWithHoverLabel from "../../../components/ButtonWithHoverLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import ItemCard from "../../../components/ItemCard";
import ItemCardInfo from "../../../components/ItemCardInfo";
import {AnimatePresence, motion} from 'framer-motion'
import { debounce } from 'lodash';

type Props = {
  children: Individual[];
  isParentBeingHovered?: boolean;
  displayInfoCard: (id: number) => void
  displayNewInfoCard: (mother_id: number, father_id: number) => void
}

const LineageGeneration: React.FC<Props> = ({children, displayInfoCard, displayNewInfoCard, isParentBeingHovered=false}) => {
  const [activeMateIndex, setActiveMateIndex] = useState<number[]>(children.length > 2 ? [0] : [0, 0]);
  const [activeIdOfAggregates, setActiveIdOfAggregates] = useState<number | undefined>();
  const [hoveredNodeId, setHoveredNodeId] = useState<number | undefined>();
  const [isHoveringSiblingCounter, setIsHoveringSiblingCounter] = useState<boolean>(false);
  function getActiveNode() {
    return children.find(child => child.id === activeIdOfAggregates);
  }

  function getHoveredNode() {
    return children.find(child => child.id === hoveredNodeId);
  }

  const childrenRef = useRef<HTMLLIElement>(null)

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

  let computedXPositionsForAggregateNodes: number[];

  if (children.length > 2) {
    computedXPositionsForAggregateNodes = computeXPositioningInOrder(children.length, 44)
  }

  const prevActiveIndex = useRef<number[]>([0,0])

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

  const debouncedSetHoveredNodeId = debounce(setHoveredNodeId, 300);


  const handleHover = (id: number) => {
    debouncedSetHoveredNodeId(id);
  };

  const handleUnHover = () => {
    debouncedSetHoveredNodeId.cancel();
    setHoveredNodeId(undefined)
  };


  const getNextParent = (nodePosition: number = 0) => {
    setActiveMateIndex(prevState => {
      const state = [...prevState];
      prevActiveIndex.current = [...state]
      const numberOfMates = children[nodePosition].mates.length
      state[nodePosition] = ((prevState[nodePosition]) + 1) % numberOfMates;
      return state;
    });
  }

  const getPrevParent = (nodePosition: number = 0) => {
    setActiveMateIndex(prevState => {
      const state = [...prevState];
      prevActiveIndex.current = [...state]
      const numberOfMates = children[nodePosition].mates.length
      state[nodePosition] = Math.abs(prevState[nodePosition] - 1) % numberOfMates;
      return state;
    });
  }

  const handleMouseEnterSiblingCounter = () => {
    setIsHoveringSiblingCounter(true)
  }

  const handleMouseLeaveSiblingCounter = () => {
    setIsHoveringSiblingCounter(false)
  }

  return (
    <ul className={`${LineageTreeStyles.childrenContainer}`}>
      {children.length > 2 
        ? 
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
              className={`${typeof activeIdOfAggregates === "number" && !getActiveNode()?.mates?.[activeMateIndex[0]]?.children?.length ? LineageTreeStyles.hasNoChildren : LineageTreeStyles.parentsContainer}`}
              style={{width: `${typeof activeIdOfAggregates === "number" ? 568 : 176 + ((children.length-1) * 44)}px`}}
              onMouseLeave={handleUnHover}
            >
              {children.map((node, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className={`${LineageTreeStyles.fatherContainer} ${LineageTreeStyles.fatherContainerOfActive} ${activeIdOfAggregates === node.id ? `fadeInElement` : "fadeOutElement"}`}>
                      {node.mates.length > 1 && (
                        <div className={LineageTreeStyles.paginateMatesContainer}>
                          <ButtonWithHoverLabel label="Next Mate">
                            <button onClick={() => getNextParent()}><FontAwesomeIcon icon={faChevronUp} /></button>
                          </ButtonWithHoverLabel>
                          <ButtonWithHoverLabel label="Previous Mate">
                            <button onClick={() => getPrevParent()}><FontAwesomeIcon icon={faChevronDown} /></button>
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
              {(((getHoveredNode()?.mates[activeMateIndex[0]]?.children?.length || 0) > 0) || ((getActiveNode()?.mates[activeMateIndex[0]]?.children?.length || 0) > 0)) && (
                <LineageGeneration 
                  key={`child-${children[0].id}`}
                  children={
                    getHoveredNode()?.mates[activeMateIndex[0]]?.children?.length ? 
                    getHoveredNode()?.mates[activeMateIndex[0]].children as Individual[] : 
                    getActiveNode()?.mates[activeMateIndex[0]].children as Individual[]
                  }
                  isParentBeingHovered={isParentBeingHovered || typeof hoveredNodeId === "number"}
                  displayInfoCard={displayInfoCard}
                  displayNewInfoCard={displayNewInfoCard}
                />
              )}
            </AnimatePresence>
          </motion.li>
        : children.map((node, index) => (
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
            `}>
              {/* need to maintain width */}
              {(node.mates[activeMateIndex[index]]?.children?.length || 0 > 0) &&
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
                    children={node.mates[activeMateIndex[index]].children as Individual[]} 
                    isParentBeingHovered={isParentBeingHovered || hoveredNodeId === node.id}
                    displayInfoCard={displayInfoCard}
                    displayNewInfoCard={displayNewInfoCard}
                  /> 
              : null}
            </AnimatePresence>
          </motion.li>
        ))
      }
    </ul> 
  )
}

export default LineageGeneration

