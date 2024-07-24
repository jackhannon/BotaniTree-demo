import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import DragDropStyles from '../styles/DragDropStyles.module.css'
import { faX } from '@fortawesome/free-solid-svg-icons'

type Props = {
  index: number;
  handleRemoveFile: (index: number) => void;
  image: string
}
const Upload:React.FC<Props> = ({handleRemoveFile, index, image}) => {
  return (
    <div className={DragDropStyles.uploadContainer}>
      <div className={DragDropStyles.imageInfo}>
        <img src={image} alt="upload" />
        <span>{image}</span>
      </div>
      <button onClick={() => handleRemoveFile(index)} className={DragDropStyles.removeImage}>
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
  )
}

export default Upload