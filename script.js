const audio = document.querySelector("audio");
const audioContext = new AudioContext();
const numberOfBars = 60;
const audioSource = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

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
        const barHeight = Math.max(4, data || 0);
        bar.style.height = barHeight + "px";
        const barColour = 
        bar.style.backgroundColor = `rgb(${barHeight + 100}, ${barHeight + 50}, ${barHeight + 200})`;   
    }
    window.requestAnimationFrame(renderFrame);
}
renderFrame();