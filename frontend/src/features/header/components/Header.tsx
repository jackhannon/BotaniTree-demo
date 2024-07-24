import React from 'react'
import headerStyles from "../styles/headerStyles.module.css";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from './SearchBar';
import { useNavigate } from '@tanstack/react-router';
import { usePlantContext } from '../../../context/PlantContext';


const Header: React.FC = () => {

  const {species, group} = usePlantContext()

  const specificSpeciesInfo = 
  (typeof species.id === "number" && typeof group?.id !== "number")
  ? species
    : undefined

  const specificGroupInfo = 
    (typeof species.id === "number" && typeof group?.id === "number")
    ? group
    : undefined

  const navigate = useNavigate({ from: '/' });

  const handleGoBack = () => {
    if (typeof species.id === "number" && typeof group?.id === "number") {
      navigate({ to: `/`});
    }
  };
  
  return (
    <>
      <div className={headerStyles.viewHeader}>
        <div className={headerStyles.plantName}>
          {(typeof species.id === "number" && typeof group?.id === "number") ?
            <FontAwesomeIcon icon={faChevronLeft} onClick={handleGoBack}/>
          : null}
          {typeof species.id !== "number" ? 
            "Species" :
          specificSpeciesInfo ? 
            specificSpeciesInfo.name : 
          specificGroupInfo ?
            specificGroupInfo.name :
            null
          }
        </div>
        <SearchBar />
      </div> 
    </>
  )
}


export default Header