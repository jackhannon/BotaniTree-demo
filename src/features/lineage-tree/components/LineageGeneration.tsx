import React, { useRef, useState } from "react";
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
}

const LineageGeneration: React.FC<Props> = ({children, displayInfoCard, displayNewInfoCard, isParentBeingHovered=false}) => {
  const [activeMateIndex, setActiveMateIndex] = useState<number[]>(Array(children.length).fill(0));
  const [hoveredNodeId, setHoveredNodeId] = useState<number | undefined>();


  const prevActiveIndex = useRef<number[]>([0,0])


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
      state[nodePosition] = (prevState[nodePosition] + 1) % numberOfMates;
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

  console.log(children)

  return (
    <ul className={`${LineageTreeStyles.childrenContainer}`}>
      {children.length > 2 
        ? 
          <AggregateGeneration 
            key={children.length + children[0].id}
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
            key={children.length + children[0].id}
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
  )
}

export default LineageGeneration

