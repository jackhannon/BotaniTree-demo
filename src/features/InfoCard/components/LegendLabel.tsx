import PieLegendStyles from "../styles/PieLegendStyles.module.css"
import InfoBox from "../../../components/InfoBox"
import InfoCardStyles from '../styles/InfoCardStyles.module.css'
import {useRef, useState } from "react"
import { HexColorPicker } from "react-colorful";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { useInfoCardContext } from "../../../context/InfoCardContext"

type Props = {
  label: string,
  value: number,
  dataIndex: number,
  backgroundColor: string, 
  borderColor:string,
  handleRemoveLabel: (dataIndex:number) => void
  handleLabelValueChange: (index: number, newValue: number) => void,
  handleLabelChange: (index: number, newLabel: string) => void,
  combinedPercent: number
  handleColorChange: (dataIndex: number, color: string) => void
  removeSubstrateMode: boolean
}

const LegendLabel:React.FC<Props> = ({handleLabelValueChange, handleLabelChange, handleRemoveLabel, handleColorChange, label, value, backgroundColor, borderColor, dataIndex, combinedPercent, removeSubstrateMode}) => {
  const {isInfoCardNewOrEditing} = useInfoCardContext()
  const [isInValidAmount, setIsInvalidAmount] = useState<boolean>(false)
  const [isHoveringColorBox, setIsHoveringColorBox] = useState<boolean>(false)

  const fieldRef = useRef<HTMLInputElement>(null)




  const handleValueChange = (eventValue: string) => {
    const newValue = Number(eventValue)
    if (((combinedPercent - value) + newValue) <= 100) {
      setIsInvalidAmount(false)
      handleLabelValueChange(dataIndex, newValue)
    } else {
      setIsInvalidAmount(true)
      if (fieldRef.current) {
        fieldRef.current.focus()
      }
    }
  }

  return (
    <li className={PieLegendStyles.label}>
      {!removeSubstrateMode ? (
        <div 
          onMouseEnter={() => setIsHoveringColorBox(true)} 
          onMouseLeave={() => setIsHoveringColorBox(false)} 
          className={PieLegendStyles.colorBox} style={{backgroundColor: backgroundColor, border: `1px solid ${borderColor}`}}
        >
          {isHoveringColorBox && (
            <div className={PieLegendStyles.colorPicker}>
              <HexColorPicker onChange={(color) => handleColorChange(dataIndex, color)} color={backgroundColor}/>
            </div>
          )}
        </div>
      ) : (
        <button className={PieLegendStyles.deleteLabelIcon} onClick={()=>handleRemoveLabel(dataIndex)}>
          <FontAwesomeIcon icon={faXmark}/>
        </button>
      )}

      {isInfoCardNewOrEditing ? (
        <input 
          type='text'
          value={label}
          onChange={(e) => handleLabelChange(dataIndex, e.target.value)}
          className={PieLegendStyles.labelInput}
        />
      ) : (
        <div className={PieLegendStyles.labelName}>
          {label}
        </div>
        )
      }
      {isInfoCardNewOrEditing && (
        <>
          -
          <input 
            ref={fieldRef}
            type='number'
            max={100}
            min={0}
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            className={PieLegendStyles.percentInput}
          />
          &nbsp;%
          {(isInValidAmount && document.activeElement === fieldRef.current) &&
            <InfoBox message='max percentage reached' styles={InfoCardStyles.instructions} />
          }
        </>
      )}
    
    </li>
  )
}

export default LegendLabel