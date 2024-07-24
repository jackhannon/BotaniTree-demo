import InfoBox from "../../../components/InfoBox"
import InfoCardStyles from '../styles/InfoCardStyles.module.css'
import {useRef, useState } from "react"
import ChartStyles from '../styles/ChartStyles.module.css'
import useClickOutside from "../../../hooks/useClickOutside"

type Props = {
  label: string,
  value: number,
  dataIndex: number,
  backgroundColor: string, 
  borderColor:string,
  handleLabelValueChange: (index: number, newValue: number) => void,
}

const WaterLabel:React.FC<Props> = ({handleLabelValueChange, label, value, dataIndex}) => {
  const [wasInvalidAmount, setWasInvalidAmount] = useState<boolean>(false)
  const fieldRef = useRef<HTMLInputElement>(null)


  const onClickOutsideInput = () => {
    setWasInvalidAmount(false)
  }

  useClickOutside(fieldRef, onClickOutsideInput)

  const handleValueChange = (eventValue: string) => {
    const newValue = Number(eventValue)
    if (newValue <= 100) {
      setWasInvalidAmount(false)
      handleLabelValueChange(dataIndex, newValue)
    } else {
      setWasInvalidAmount(true)
      if (fieldRef.current) {
        fieldRef.current.focus()
      }
    }
  }

  return (
    <li className={ChartStyles.label}>
      <div className={ChartStyles.labelName}>
        {label}
      </div>
      -
      <input 
        ref={fieldRef}
        type='number'
        placeholder="waterings"
        max={100}
        min={0}
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        className={ChartStyles.wateringsInput}
      />
      {(wasInvalidAmount && document.activeElement === fieldRef.current) &&
        <InfoBox message="you can't water more than 100 times a month" styles={InfoCardStyles.instructions} />
      }

    
    </li>
  )
}

export default WaterLabel