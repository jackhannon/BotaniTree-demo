import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CardStyles from '../styles/cardAndListStyles.module.css'
import { ReactNode } from '@tanstack/react-router'
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
type Props = {
  image?: string;
  name?: string;
  id?: number;
  handleClick?: (id: number) => void;
  sizeStyles: string;
  hovered?: boolean;
  handleHover?: (id: number) => void;
  handleUnHover?: () => void;
  imageDimensions: {width: number, height?: number};
  children: ReactNode;
  styles?: string;
}

const ItemCard: React.FC<Props> = ({image, id, handleClick = ()=>{}, sizeStyles, styles, handleHover = ()=>{}, handleUnHover = ()=>{}, children}) => {
  return (
    <div 
      aria-label={`item-${id}`}
      className={`${CardStyles.cardContent} ${sizeStyles} ${styles}`}
      onClick={()=> handleClick(id as number)}
      onMouseEnter={() => handleHover(id as number)} 
      onMouseLeave={handleUnHover} 
    >
      {image ? 
        <img className={CardStyles.image}
          src={image}
          alt='plant'
        />
      : 
      <div className={`${CardStyles.image} ${CardStyles.noImagePlaceholder}`}>
        <FontAwesomeIcon icon={faQuestion}/>
      </div>
      }
      {children}
    </div>
  )
}

export default ItemCard
