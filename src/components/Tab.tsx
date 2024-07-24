import React from 'react'
import TabStyles from '../styles/tabStyles.module.css'
type Props = {
  activeTab: string;
  handleTabClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
  tabName: string;
}
const Tab:React.FC<Props> = ({activeTab, handleTabClick, tabName}) => {
  return (
    <span 
      className={`${TabStyles.navTab} ${activeTab === tabName ? TabStyles.active : ''}`}
      id={tabName}
      onClick={(e) =>handleTabClick(e)}
      >{tabName}
    </span>
  )
}

export default Tab