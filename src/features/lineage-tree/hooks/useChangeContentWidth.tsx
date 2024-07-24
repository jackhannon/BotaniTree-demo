import { useLayoutEffect } from 'react'

const useChangeContentWidth = (container: React.RefObject<HTMLLIElement>, widthToTransitionFrom: number, conditionToRun: boolean, dependencies: Array<string | number>, isAnimating: React.MutableRefObject<boolean>) => {
  useLayoutEffect(() => {
    if (conditionToRun && container.current) {
      isAnimating.current = true;
      const liWidth = container?.current?.offsetWidth;
      const newContentWidth = liWidth - widthToTransitionFrom;
      const elementTransition = container?.current?.style.transition;
      container.current.style.transition = "";
      container.current.style.width = widthToTransitionFrom + "px"

      requestAnimationFrame(() => {
        if (container.current) {
          container.current.style.width = widthToTransitionFrom + "px"
          container.current.style.transition = elementTransition;
        }
      
         // On the next frame, transition the height to include the new content
        requestAnimationFrame(function() {
          if (container.current) {
            container.current.style.width = (widthToTransitionFrom+ newContentWidth) + 'px';
          }
        });
      })

      container.current.addEventListener('transitionend', function transitionEndHandler() { 
        if (container.current) {
          container.current.removeEventListener('transitionend', transitionEndHandler);   
          isAnimating.current = false;
          container.current.style.width = "";
        }  
      });

    }
  }, [container, widthToTransitionFrom, conditionToRun, ...dependencies])
  return isAnimating.current
}

export default useChangeContentWidth