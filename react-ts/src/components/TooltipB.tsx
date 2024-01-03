import {  useEffect, useRef } from 'react';
import { Tooltip } from 'bootstrap';
import { useLocation } from 'react-router-dom';

type Props = {
    title: string,
    children:React.ReactNode
}

const TooltipB = ({title, children}:Props) => {

  const location = useLocation();

    const toolRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
      let tooltip:any;
      if(toolRef.current){
         [toolRef.current].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
         tooltip = Tooltip.getOrCreateInstance(toolRef.current)
      }  
      return () => {
        tooltip.hide()
      }
    }, [location.pathname])
  
  return (
    <div className='invoice_tooltip' data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title={title} ref={toolRef}>
        {children}
    </div>
  )
}

export default TooltipB