import React from 'react';
import { useInView } from 'react-intersection-observer';


// i extend props with  React.PropsWithChildren means i don't need to write children;
interface  props extends React.PropsWithChildren {
    onBottomReached : () => void;
    className? : string
}



export default function InfiniteScrollContainer({children, onBottomReached, className} :props ) {

    const {ref} = useInView({
        rootMargin : '200px',
        onChange(inView){
            if(inView){
                onBottomReached()
            }
        }
    })

  return (
    <div className={className}>
      {children}
      <div ref={ref}></div>
    </div>
  )
}
