import React from 'react';

function InfoContent() {
    return (
        <div className="info-content">
            
            <h1>Tile Transform Generator</h1>
            <p>Welcome to the Tile Transform Generator! </p>
            
            <p>This is a playful experiment that transforms your images into abstract patterns using simple geometric shapes. 
                The algorithm creates a set of tiles, randomly generated with a specified number of colors, line thicknesses, and basic shapes. 
                Then it breaks down your image into square blocks and matches the tile that best represents the content of the block. </p>

            <p>The results can be surprising! </p>

            <div className="info-images">
                <img 
                    src={process.env.PUBLIC_URL + '/images/jmb.jpg'} 
                    alt="Sample tile pattern"
                    className="sample-image"
                />
            </div>

        
            <h2>Playing with Parameters</h2>
            <p>These parameters are defined in the left panel:</p>
            <ul>
                <li><strong>Number of Colors</strong>: Choose how many colors to use from the palette. Fewer colors create more cohesive patterns.</li>
                <li><strong>Line Thickness</strong>: Select the thickness of lines in the patterns. Mix thick and thin lines for interesting effects.</li>
                <li><strong>Number of Tiles</strong>: This determines how many unique pattern tiles will be generated.</li>
                <li><strong>Sequential Colors</strong>: When enabled, colors are picked in sequence from the palette. When disabled, they're chosen randomly.</li>
            </ul>

            <h2>Tips for Best Results</h2>
            <p>Hit the 'Generate' button multiple times! Each generation creates a new set of random patterns, 
                so you might find something unexpected. </p>

            <h2>About Your Images</h2>
            <p>This is a client-side application - your images are processed entirely in your browser and are never uploaded 
                to any server. The transformed images are yours to keep and use as you wish.</p>

            <h2>Open Source</h2>
            <p>This project is open source and available on <a href="https://github.com/saha-raj/tile-pattern-app">GitHub</a>. Feel free to explore the code, contribute, or adapt it for your own creative projects.</p>

        </div>
    );
}

export default InfoContent;