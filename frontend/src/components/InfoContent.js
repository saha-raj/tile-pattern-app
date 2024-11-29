import React from 'react';

function InfoContent() {
    return (
        <div className="info-content">
            <h1>some header</h1>
            <p>some text about how this works</p>
            
            <div className="info-images">
                {/* We can add placeholder images here later */}
            </div>
            
            <p>some more text</p>
            
            <h2>second tier header</h2>
            <p>more text</p>
        </div>
    );
}

export default InfoContent;