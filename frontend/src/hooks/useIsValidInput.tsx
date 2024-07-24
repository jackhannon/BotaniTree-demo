import { useCallback, useState } from 'react'

const useIsValidInput = (minChars: number, maxChars: number, initialValue = ""): [boolean, string, (eventInput: string) => void] => {
  const [input, setInput] = useState<string>(initialValue)
  const [isInputValid, setIsInputValid] = useState<boolean>(initialValue.length > minChars && initialValue.length < maxChars)

  const handleSetInput = useCallback((input: string, eventInput: string) => {
    if (eventInput.length < minChars) {
      setIsInputValid(false)
      return eventInput
    }
    if (eventInput.length > maxChars) {
      return input
    }
    setIsInputValid(true)
    return eventInput
  }, [maxChars, minChars])

  const handleChange = useCallback((eventInput: string) => {
    if (eventInput === input) {
      return
    } 
    setInput(input => {
      return handleSetInput(input, eventInput)
    })
  }, [handleSetInput, input])
  
  return [isInputValid, input, handleChange]
}

export default useIsValidInput