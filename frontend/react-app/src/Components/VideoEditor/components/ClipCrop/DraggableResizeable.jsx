import React, { useState, useRef } from 'react';

export default function DraggableResizable({
    children,
    bounds,
    size,
    position,
    onDragStop,
    onResizeStop,
    style = {},
    ...props
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const elementRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('resize-handle')) return; // This is to prevent dragging if the user clicks on the resize handle.
        // If not, then dragging = true, and proceed to grab the position of the box, relative to the size of the screen.
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        e.preventDefault();
    };

    const handleResizeMouseDown = (e) => {
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
        e.preventDefault();
        e.stopPropagation();
    }
}
return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        ...style
      }}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {children}
      <div
        className="resize-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 15,
          height: 15,
          backgroundColor: 'rgba(0,0,0,0.5)',
          cursor: 'nw-resize',
          borderRadius: '0 0 4px 0'
        }}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );