import { useSelector } from "react-redux";
export default function ActiveOverlay() {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);
    console.log(activeOverlayHeight);
    return <div className="overlay" style={{width: overlayDimensions[0]+"px", height: activeOverlayHeight+"px"}}></div>
}