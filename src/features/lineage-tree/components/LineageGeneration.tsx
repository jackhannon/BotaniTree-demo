import React, { useState } from "react";
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
  const [hoveredNodeId, setHoveredNodeId] = useState<number | undefined>();
  
  const debouncedSetHoveredNodeId = debounce(setHoveredNodeId, 300);

  const handleHover = (id: number) => {
    debouncedSetHoveredNodeId(id);
  };

  const handleUnHover = () => {
    debouncedSetHoveredNodeId.cancel();
    setHoveredNodeId(undefined)
  };

  

  return (
    <>
    <ul className={`${LineageTreeStyles.childrenContainer}`}>
      {children.length > 2 
        ? 
          <AggregateGeneration
            children={children} 
            isParentBeingHovered={isParentBeingHovered} 
            displayInfoCard={displayInfoCard}
            displayNewInfoCard={displayNewInfoCard}
            handleHover={handleHover}
            handleUnHover={handleUnHover}
            hoveredNodeId={hoveredNodeId}
          />
        : 
          <TwoNodeGeneration
            isPreview={isPreview}
            children={children} 
            isParentBeingHovered={isParentBeingHovered} 
            displayInfoCard={displayInfoCard}
            displayNewInfoCard={displayNewInfoCard}
            handleHover={handleHover}
            handleUnHover={handleUnHover}
            hoveredNodeId={hoveredNodeId}
          />
      }
    </ul> 
      {(isPreview && previewChildCount) && <span className={LineageTreeStyles.previewNote}>...click to view <b>{previewChildCount}</b> more children</span>}
    </>
  )
}

export default LineageGeneration

