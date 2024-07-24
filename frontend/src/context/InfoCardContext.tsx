import React, { createContext, useContext, useState } from 'react'

type ProviderProps = {
  children: React.ReactNode;
}

type Context = {
  changeCatagories: (catagory?: "group" | "species" | "plant") => void
  toggleInfoCardEditModeOn: () => void
  toggleInfoCardOff: () => void
  toggleInfoCardOn: (payload: ToggleOnPayload) => void
  isOpen: boolean
  isInfoCardNewOrEditing: boolean
  motherId?: number,
  fatherId?: number
  catagory?: "group" | "species" | "plant"
  itemId?: number
}

type ToggleOnPayload = {
  isInfoCardNewOrEditing?: boolean
  itemId?: number
  catagory: "group" | "species" | "plant"
  mother_id?: number,
  father_id?: number
}

const InfoCardContext = createContext({} as Context);


export const useInfoCardContext = () => {
  return useContext(InfoCardContext)
}

export const InfoCardProvider: React.FC<ProviderProps> = ({children}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isInfoCardNewOrEditing, setIsInfoCardNewOrEditing] = useState<boolean>(false)
  const [motherId, setMotherId] = useState<number>()
  const [fatherId, setFatherId] = useState<number>()

  const [catagory, setCatagory] = useState<"group" | "species" | "plant" | undefined>()
  const [itemId, setItemId] = useState<number>()

  function toggleInfoCardOff() {
    setIsOpen(false)
    setIsInfoCardNewOrEditing(false)
    setCatagory(undefined)
    setItemId(undefined)
  }
  

  function toggleInfoCardOn(payload: ToggleOnPayload) {
    setIsOpen(true)
    setIsInfoCardNewOrEditing(payload.isInfoCardNewOrEditing || false)
    setCatagory(payload.catagory)
    setItemId(payload.itemId)
    setMotherId(payload?.mother_id)
    setFatherId(payload?.father_id)
  }

  function toggleInfoCardEditModeOn() {
    setIsInfoCardNewOrEditing(true)
  }

  function changeCatagories(catagory: "group" | "species" | "plant" | undefined) {
    setCatagory(catagory)
  }



  const context = {
    changeCatagories,
    toggleInfoCardEditModeOn,
    toggleInfoCardOff,
    toggleInfoCardOn,
    isOpen,
    isInfoCardNewOrEditing,
    fatherId,
    motherId,
    catagory,
    itemId
  }

  return (
    <InfoCardContext.Provider value={context}>
      {children}
    </InfoCardContext.Provider>
  )
}

