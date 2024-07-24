import { useCallback, useRef } from "react"

const useInvalidateParentWidthRefCallback = (callback: ((newULwidth: number) => void) | undefined): [React.RefCallback<HTMLUListElement>] => {
  const ulRef = useRef<HTMLUListElement | null>(null)
  const setRef = useCallback((node: HTMLUListElement) => {
    ulRef.current = node

    if (node && callback) {
      if (ulRef?.current) {
        callback(ulRef.current.offsetWidth)
      }
    } 
  }, [callback])
  return [setRef]
}

export default useInvalidateParentWidthRefCallback
