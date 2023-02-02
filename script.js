button.addEventListener("click", function(){
    const audioControls = document.querySelector("#myAudio");
    audioControls.style.visibility = "inherit";
    const sliderControls = document.querySelector("#slider");
    sliderControls.style.visibility = "inherit";
    analyser = init();
    const button = document.querySelector("#button");
    button.style.display = "none";
    button.disabled = true;
})

// Set number of bars
const numberOfBars = 75;

// Get visualiser container
const visualiserContainer = document.querySelector(".visualiser-container");

// Create bars
for( let i = 0; i < numberOfBars; i++) {
    const bar = document.createElement("DIV");
    bar.setAttribute("id", "bar" + i );
    bar.setAttribute("class", "visualiser-container-bar");
    visualiserContainer.appendChild(bar);
}

let smoothingConstant = 0;
function updateSmoothness(smoothness){
    smoothingConstant = smoothness;
}; 

function init(){
    console.log("init");

    // Get audio element
    let audio = document.querySelector("audio");
    
    // Create audio context
    let audioContext = new AudioContext();

    // Create audio source
    let audioSource = audioContext.createMediaElementSource(audio);
    
    // Create audio analyser
    let analyser = audioContext.createAnalyser();
    
    // Connect source node to analyser
    audioSource.connect(analyser);
    audioSource.connect(audioContext.destination);
    
    function renderFrame() {        
        // Create frequency data array
        let frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
        for( let i = 0; i < numberOfBars; i++) {
            const data = frequencyData[i];
            const bar = document.querySelector("#bar" + i);
            if(!bar){
                continue;
            }
            let barHeight = (Math.max( data * 5 ) + bar.offsetHeight) / 2;
            if( i != 0 && i < numberOfBars - 2){
                const previousBar = document.querySelector("#bar" + (i-1));
                const nextBar = document.querySelector("#bar" + (i+1));
                barHeight = ((previousBar.offsetHeight + nextBar.offsetHeight) / 2) * smoothingConstant + barHeight * (1 - smoothingConstant); 
            }
            bar.style.height = barHeight + "px";
            bar.style.backgroundColor = `hsl(${barHeight}, 50%, 50%)`;
        }
        window.requestAnimationFrame(renderFrame);
    };
    renderFrame();
};
