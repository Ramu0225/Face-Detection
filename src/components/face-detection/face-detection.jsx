import React from "react";
import './face-detection.styles.css';
const FaceDetection =({imageUrl, box})=>{
    return(
        <div className='center'>
            <div className='absolute mt3 '>
                <img id= 'inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
                {box.map((b,i) => (
                 <div className='bounding_box' key= {i} style={{top:b.topRow, right:b.rightCol, bottom: b.bottomRow, left: b.leftCol}} />
                ))}
                </div>    
        </div>
    );
}

export default FaceDetection;