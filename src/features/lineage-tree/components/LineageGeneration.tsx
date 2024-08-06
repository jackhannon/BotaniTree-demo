import React, { useEffect, useRef, useState } from "react";
import LineageTreeStyles from '../styles/LineageTreeStyle.module.css'
import { Individual } from "../../../types";
import { debounce } from 'lodash';
import AggregateGeneration from "./AggregateGeneration";
import TwoNodeGeneration from "./TwoNodeGeneration";


type Props = {
  children: Individual[];
  isParentBeingHovered?: boolean;
  displayInfoCard: (id: number) => void
  displayNewInfoCard: (mother_id: number, father_id: number) => void
  isPreview?: boolean,
  previewChildCount?: number;
}

const LineageGeneration: React.FC<Props> = ({children, displayInfoCard, displayNewInfoCard, isParentBeingHovered=false, isPreview, previewChildCount}) => {
  const [activeMateIndex, setActiveMateIndex] = useState<number[]>(Array(children.length).fill(0));
  const [hoveredNodeId, setHoveredNodeId] = useState<number | undefined>();
  
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

  return (
    <>
    <ul className={`${LineageTreeStyles.childrenContainer}`}>
      {children.length > 2 
        ? 
          <AggregateGeneration 
            key={(children.length || 0) + (children[0].id || 0)}
            children={children} 
            isParentBeingHovered={isParentBeingHovered} 
            displayInfoCard={displayInfoCard}
            displayNewInfoCard={displayNewInfoCard}
            handleHover={handleHover}
            handleUnHover={handleUnHover}
            activeMateIndex={activeMateIndex}
            hoveredNodeId={hoveredNodeId}
            getNextParent={getNextParent}
            getPrevParent={getPrevParent}

          />
        : 
          <TwoNodeGeneration
            key={(children.length || 0) + (children[0].id || 0)}
            isPreview={isPreview}
            children={children} 
            isParentBeingHovered={isParentBeingHovered} 
            displayInfoCard={displayInfoCard}
            displayNewInfoCard={displayNewInfoCard}
            handleHover={handleHover}
            handleUnHover={handleUnHover}
            activeMateIndex={activeMateIndex}
            hoveredNodeId={hoveredNodeId}
            getNextParent={getNextParent}
            getPrevParent={getPrevParent}
          />
      }
    </ul> 
      {(isPreview && previewChildCount) && <span className={LineageTreeStyles.previewNote}>...click to view <b>{previewChildCount}</b> more children</span>}
    </>
  )
}

export default LineageGeneration

