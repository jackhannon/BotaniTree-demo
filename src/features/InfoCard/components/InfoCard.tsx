import React, { useCallback, useRef, useState } from 'react'
import InfoCardStyles from '../styles/InfoCardStyles.module.css'
import '../styles/quillStyles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCheck, faChevronLeft, faChevronRight, faGear, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons'
import ButtonWithHoverLabel from '../../../components/ButtonWithHoverLabel'
import Tab from '../../../components/Tab'
import TabStyles from '../../../styles/tabStyles.module.css'
import MiniLineageTree from './MiniLineageTree'
import SubstrateChart from './SubstrateChart'
import WaterChart from './WaterChart'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import { DeltaStatic } from 'quill'
import useIsValidInput from '../../../hooks/useIsValidInput'
import CatagorySpecificInfo from './CatagorySpecificInfo'
import { Individual, SubstrateEntry, WaterEntry } from '../../../types'
import { useInfoCardContext } from '../../../context/InfoCardContext'
import { usePlantContext } from '../../../context/PlantContext'
import { generateName, keyGen } from '../../../utils/keyGen'
import { isJsonString } from '../../../utils/isJsonString'



const InfoCard:React.FC = () => {
  const modules = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'},],
      [{ 'align': [] }],
      ['link'],
    ]
  };
  
  const {itemId, motherId: newPlantMotherId, fatherId: newPlantFatherId, catagory, isInfoCardNewOrEditing, isOpen, toggleInfoCardOff, toggleInfoCardOn, toggleInfoCardEditModeOn} = useInfoCardContext()
  const {species, getCurrentSpecies, getCurrentGroup, getCurrentPlant, addPlant, removePlant, changePlant, addGroup, removeGroup, changeGroup, changeSpecies} = usePlantContext()

  const prevItemId = useRef<number | undefined>()
  const generatedIndividualNameRef = useRef<string>("")
  
  const cardInfo = 
    (typeof itemId === "number" && catagory === "species" && isOpen) 
    ? getCurrentSpecies(itemId) :
    (typeof itemId === "number" && catagory === "group" && isOpen) 
    ? getCurrentGroup(itemId) :
    (catagory === "plant" && isOpen) 
    ? getCurrentPlant(itemId) :
    undefined;
    
  const [descriptionDelta, setDescriptionDelta] = useState<DeltaStatic | undefined>(isJsonString(cardInfo?.description_delta) ? JSON.parse(cardInfo?.description_delta as string) : "");
  const [descriptionHTML, setDescriptionHTML] = useState<string>(cardInfo?.description_html || "");
  const [substrateValues, setSubstrateValues] = useState<SubstrateEntry[]>(cardInfo?.substrate_values || [{percent: 50, substrate: "pumice", color: "#1a3b52"}, {percent: 50, substrate: "soil", color: "#ab691e"}]);
  const [waterValues, setWaterValues] = useState<WaterEntry[]>(cardInfo?.water_values || [
    { "month": "January", "water_count": 4 },
    { "month": "February", "water_count": 4 },
    { "month": "March", "water_count": 4 },
    { "month": "April", "water_count": 4 },
    { "month": "May", "water_count": 4 },
    { "month": "June", "water_count": 4 },
    { "month": "July", "water_count": 4 },
    { "month": "August", "water_count": 4 },
    { "month": "September", "water_count": 4 },
    { "month": "October", "water_count": 4 },
    { "month": "November", "water_count": 4 },
    { "month": "December", "water_count": 4 }
  ]
);
  const [lightValue] = useState<number>(cardInfo?.light_value || 12);
  const [deathDate, setDeathDate] = useState<number | undefined>((cardInfo as Individual)?.death_date);
  const [isClone, setIsClone] = useState<boolean | undefined>((cardInfo as Individual)?.is_clone);
  const [isArtificialConditions, setIsArtificialConditions] = useState<boolean | undefined>((cardInfo as Individual)?.is_artificial_conditions);
  const [fatherId, setFatherId] = useState<number | undefined>(typeof (cardInfo as Individual)?.father_id === "number" ? (cardInfo as Individual)?.father_id : newPlantFatherId)
  const [motherId, setMotherId] = useState<number | undefined>(typeof (cardInfo as Individual)?.mother_id === "number" ? (cardInfo as Individual)?.mother_id : newPlantMotherId)
  const [groupId, setGroupId] = useState<number | undefined>((cardInfo as Individual)?.group_id)
  const [images, setImages] = useState<string[]>((cardInfo as Individual)?.images || [])

  const [isNameValid, name, handleNameChange] = useIsValidInput(1, 50, cardInfo?.name || generateName() || "");
  const [activeTab, setActiveTab] = useState("Info")

  prevItemId.current = itemId
  generatedIndividualNameRef.current = cardInfo?.name || generateName()

  const handleChangeSubstrate = useCallback((substrate_values: SubstrateEntry[]) => {
    setSubstrateValues(substrate_values)
  }, [])

  const handleChangeWater = useCallback((water_values: WaterEntry[]) => {
    setWaterValues(water_values)
  }, [])
  
  const handleChangeFatherId = useCallback((fatherId: number) => {
    setFatherId(fatherId)
  }, [])

  const handleChangeMotherId = useCallback((motherId: number) => {
    setMotherId(motherId)
  }, [])

  const handleGenerateIndividualName = useCallback(() => {
    handleNameChange(generatedIndividualNameRef.current)
  }, [handleNameChange])

  const handleTabClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    setActiveTab(e.currentTarget.id);
  }

  const handleToggleInfoCard = () => {
    if (isOpen) {
      toggleInfoCardOff();
    } else {
      toggleInfoCardOn({catagory: "species", itemId: 0})
    }
  }
  
  const handleConfirm = async () => {
    function filterSubstrates(substrates:SubstrateEntry[]) {
      return substrates.filter(value => value.percent > 0)
    }

    const description_string = JSON.stringify(descriptionDelta || {})
    try {
      const newPlant = {
        name,
        images,
        description_delta: description_string,
        description_html: descriptionHTML,
        substrate_values: filterSubstrates(substrateValues),
        light_value: lightValue,
        water_values: waterValues,
        mother_id: motherId,
        father_id: fatherId,
        is_clone: isClone,
        is_artificial_conditions: isArtificialConditions,
        death_date: deathDate,
        id: typeof itemId === "number" ? itemId : keyGen("plant"),
        species_id: 0,
        group_id: undefined,
        mates: []
      }

      if (catagory === "plant") {
        if (typeof itemId !== "number") {
          addPlant(newPlant)
        } else {
          changePlant(newPlant)
        }
      } else if (catagory === "group") {
        if (typeof itemId !== "number") {
          addGroup({
            name,
            images,
            description_delta: description_string,
            description_html: descriptionHTML,
            substrate_values: substrateValues,
            light_value: lightValue,
            water_values: waterValues,
            species_id: species.id,
            id: keyGen("group"),
          })
        } else {
          changeGroup({
            name,
            images,
            description_delta: description_string,
            description_html: descriptionHTML,
            substrate_values: substrateValues,
            light_value: lightValue,
            water_values: waterValues,
            species_id: species.id,
            id: itemId as number
          })
        }
      } else {
          changeSpecies({
            name, 
            images, 
            description_delta: description_string, 
            description_html: descriptionHTML, 
            substrate_values: substrateValues, 
            light_value: lightValue,
            water_values: waterValues,
            id: itemId as number
          })
      }
      toggleInfoCardOff()
    } catch (err) {
      console.log(err)
    }
  }

  const handleToggleEditView = () => {
    toggleInfoCardEditModeOn()
  }

  const handleDisgard = async () => {
    toggleInfoCardOff()
  }

  const handleDelete = async () => {
    if (catagory === "plant") {
      removePlant(itemId as number)
    } else if (catagory === "group") {
      removeGroup(itemId as number)
    }
    toggleInfoCardOff()
  }

  const handleDescriptionChange = (content: React.SetStateAction<string>, _delta: DeltaStatic, _source: string, editor: ReactQuill.UnprivilegedEditor) => {
    setDescriptionDelta(editor.getContents())
    setDescriptionHTML(content)
  }

  const toggleIsArtificialConditions = () => {
    setIsArtificialConditions(prevState => !prevState)
  }

  const toggleIsClone = () => {
    setIsClone(prevState => !prevState)
  }

  const toggleIsDead = () => {
    setDeathDate((date: number | undefined) => {
      if (date) {
        return
      } else {
        return Date.now()
      }
    })
  }
  
  let tabs = ["Info", "Substrate", "Water", "Relatives"]

  if (catagory === "species" || catagory === "group") {
    tabs = ["Info", "Substrate", "Water"]
  }



  return (
    <div className={`${InfoCardStyles.cardContainer} ${isOpen ? InfoCardStyles.showNewCard : InfoCardStyles.hideCard}`}>
      <ButtonWithHoverLabel label={isOpen ? "close" : "open"} positioningStyles={InfoCardStyles.toggleInfoCardPosition}>
        <button aria-label='toggle-info-card' className={InfoCardStyles.toggleInfoCard} onClick={handleToggleInfoCard} >
          <FontAwesomeIcon icon={isOpen ? faChevronRight : faChevronLeft}/>
        </button>
      </ButtonWithHoverLabel>
      
      <div className={`${isOpen ? InfoCardStyles.visibleCard : InfoCardStyles.invisibleCard}`}>
        {isInfoCardNewOrEditing ? (
          <>
            <div className={InfoCardStyles.confirmationButtons}>
              <button 
                aria-label='confirm-changes'
                id={InfoCardStyles.confirm} 
                onClick={handleConfirm} 
                disabled={!isNameValid}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button 
                aria-label='disgard-changes'
                id={InfoCardStyles.disgard}
                onClick={handleDisgard}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              {(typeof itemId === "number" && catagory !== "species") &&
              <button 
                aria-label='delete-item'
                id={InfoCardStyles.delete}
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrash}/>
              </button>
              }
            </div>
          </>
        ) : (
          <button aria-label="edit-item" className={InfoCardStyles.edit} onClick={handleToggleEditView}>
            <FontAwesomeIcon icon={faGear}/>
          </button>
        )}

        <CatagorySpecificInfo 
          handleGenerateIndividualName={handleGenerateIndividualName} 
          isClone={isClone}
          isArtificialConditions={isArtificialConditions}
          deathDate={deathDate}
          toggleIsArtificialConditions={toggleIsArtificialConditions}
          toggleIsClone={toggleIsClone}
          toggleIsDead={toggleIsDead}
          name={name} 
          images={images} 
          setImages={setImages} 
          groupId={groupId}
          setGroupId={setGroupId} 
          handleNameChange={handleNameChange} 
          isNameValid={isNameValid} 
        />
        <div className={TabStyles.tabContainer}>
          {tabs.map(tab => 
            <Tab handleTabClick={handleTabClick} tabName={tab} activeTab={activeTab} key={tab}/> 
            )
          }
        </div>
        {activeTab === "Info" &&
          <div className={InfoCardStyles.activeTabContents}>
            {isInfoCardNewOrEditing ? (
              <ReactQuill
              onChange={(content, delta, source, editor)=>handleDescriptionChange(content, delta, source, editor)}
              placeholder="Start writing..."
              value={descriptionDelta}
              theme='bubble' 
              modules={modules} 
              className={`${InfoCardStyles.editorInput} ${'ql-container'}`}
              />
            ) : descriptionHTML !== undefined ? (
              <div className={`ql-editor`} dangerouslySetInnerHTML={{ __html: descriptionHTML}} />
            ) : (
              <div className={InfoCardStyles.aboutContainerEmpty}></div>
            )}
            
           
          </div>
        }
        {activeTab === "Substrate" &&
          <div className={InfoCardStyles.activeTabContents}>
            <SubstrateChart substrateValues={substrateValues} handleChangeSubstrate={handleChangeSubstrate} />
          </div>
        }
        {activeTab === "Water" &&
          <div className={InfoCardStyles.activeTabContents}>
            <WaterChart waterValues={waterValues} handleChangeWater={handleChangeWater}/>
          </div>
        }
        {activeTab === "Relatives" &&
          <div className={InfoCardStyles.activeTabContents}>
            <MiniLineageTree 
              motherId={motherId}
              fatherId={fatherId}
              child={{name, image: images.length ? images[0] : "", id: cardInfo?.id || 0}}
              handleChangeFatherId={handleChangeFatherId}
              handleChangeMotherId={handleChangeMotherId}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default InfoCard