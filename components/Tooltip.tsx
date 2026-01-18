import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.top - 8, // Position above the element
      left: rect.left + rect.width / 2, // Center horizontally
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      {isVisible && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-800 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
          style={{ top: coords.top, left: coords.left }}
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -ml-1.5 border-[6px] border-transparent border-t-slate-800"></div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;