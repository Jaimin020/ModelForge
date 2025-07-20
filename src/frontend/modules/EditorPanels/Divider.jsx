import {useRef} from 'react';

const Divider = ({setLeftPanelWidth}) => {
    const isDragging = useRef(false);

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        setLeftPanelWidth(e.clientX);
    };
    
    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    const handleMouseDown = (e) => {
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    return (
    <div
        className="divider"
        onMouseDown={handleMouseDown}
    ></div>
    );
};

export default Divider;
