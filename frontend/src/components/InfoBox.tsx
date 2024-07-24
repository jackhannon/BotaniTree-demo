import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

type Props = {
  styles: string;
  message: string;
}
const InfoBox:React.FC<Props> = ({styles, message}) => {
  return (
    <p 
    id="title-validation-info" 
    className={styles}
  >
    <FontAwesomeIcon icon={faInfoCircle} />
    {message}<br />
  </p>
  )
}

export default InfoBox