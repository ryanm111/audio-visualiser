const audio = document.querySelector("audio");
const audioContext = new AudioContext();
const numberOfBars = 100;
const audioSource = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();
let smoothingConstant = 0;

audioSource.connect(analyser);
audioSource.connect(audioContext.destination);

const frequencyData = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(frequencyData);
console.log("frequencyData", frequencyData);

const visualiserContainer = document.querySelector(".visualiser-container");

for( let i = 0; i < numberOfBars; i++) {
    const bar = document.createElement("DIV");
    bar.setAttribute("id", "bar" + i );
    bar.setAttribute("class", "visualiser-container-bar");
    visualiserContainer.appendChild(bar);
}

function renderFrame() {
    analyser.getByteFrequencyData(frequencyData);

    for( let i = 0; i< numberOfBars; i++) {
        const data = frequencyData[i];
        const bar = document.querySelector("#bar" + i);
        if(!bar){
            continue;
        }
        let barHeight = (Math.max( data * 5 ) + bar.offsetHeight) / 2;
        if( i != 0 && i < 99){
            const previousBar = document.querySelector("#bar" + (i-1));
            const nextBar = document.querySelector("#bar" + (i+1));
            barHeight = ((previousBar.offsetHeight + nextBar.offsetHeight) / 2) * smoothingConstant + barHeight * (1 - smoothingConstant); 
        }
        bar.style.height = barHeight + "px";
        bar.style.backgroundColor = `hsl(${barHeight}, 50%, 50%)`;
    }
    window.requestAnimationFrame(renderFrame);
}

function updateSmoothness(smoothness){
    smoothingConstant = smoothness;
};
renderFrame();