import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DragDropStyles from '../styles/DragDropStyles.module.css'
import { ChangeEvent, useState } from "react";
import Upload from "./Upload";
import InfoBox from "../../../components/InfoBox";


type Props = {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const DragAndDrop:React.FC<Props> = ({images, setImages}) => {
  const [info, setInfo] = useState("")
  
  const readFile = (file: File) => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  const handleManualUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length > 5) {
      setInfo("Max images reached")
    }
    const files = Array.from(event.target.files).slice(0, 5);
    const images = await Promise.all(files.map(async (file) => {
      try {
        const imageDataUrl = await readFile(file);
        return imageDataUrl
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }))
    setImages(images)
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    let droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length + images.length > 5) {
      const remainingSpots = 5 - images.length;
      droppedFiles = Array.from(droppedFiles).slice(0, remainingSpots)
      setInfo("Max images reached")
    }
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles).slice(0, 5);
      const newImages = await Promise.all(newFiles.map(async (file) => {
        try {
          const imageDataUrl = await readFile(file);
          return imageDataUrl
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }))
      
      const allImages = images ? [...images, ...newImages] : [...newImages]
      setImages(allImages);
    }
  };


  const handleRemoveFile = (index: number) => {
    setImages((images.filter((_, i) => i !== index)));
    setInfo("")
  };


  return (
    <div className={DragDropStyles.dragDrop}>
      <div
        className={`${DragDropStyles.documentUploader} ${
          images?.length > 0 ? `${DragDropStyles.uploadBox} active` : `${DragDropStyles.uploadBox}`
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
          <div className={DragDropStyles.uploadInfo}>
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            <div>
              <p>Drag and drop up to 5 images of this plant</p>
            </div>
          </div>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleManualUpload}
            accept=".jpeg, .png"
            multiple
          />
          <label htmlFor="browse" className={DragDropStyles.browseBtn}>
            Browse files
          </label>
        </>

        {images?.length > 0 && (
          <div className={DragDropStyles.uploads}>
            <div className={DragDropStyles.row}>
              {images.slice(0,3).map((image, index) => (
              <Upload key={index+ Date.now()} handleRemoveFile={handleRemoveFile} index={index} image={image}/>
              ))}
            </div>
            <div className={DragDropStyles.row}>
              {images.slice(3).map((image, index) => (
              <Upload key={index+ Date.now()} handleRemoveFile={handleRemoveFile} index={index} image={image}/>
              ))}
            </div>
            {info && 
              <InfoBox message={info} styles={DragDropStyles.maxImagesInfo}/>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default DragAndDrop;