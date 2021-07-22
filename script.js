let video = document.querySelector("video");
let Start = document.querySelector("#record");
let recordDiv = Start.querySelector("div");
let capture = document.querySelector("#capture");
let captureDiv = capture.querySelector("div");
let zoom_in = document.querySelector("#zoom-in");
let zoom_out = document.querySelector("#zoom-out");
let gallery = document.querySelector("#gallery");

gallery.addEventListener("click",(e)=>{

    location.assign("Gallery.html");

});
// Implement Zoom functions 
function removeFilter() {
    let div = document.querySelector(".apply-filter");

    if (div) {
        div.remove();
    }
}

let filters = document.querySelectorAll(".filter");
let filterColor;
for (let i = 0; i < filters.length; i++) {

    filters[i].addEventListener("click", (e) => {
        removeFilter();
        filterColor = e.currentTarget.style.backgroundColor;
        let div = document.createElement("div");
        div.classList.add("apply-filter");
        div.style.backgroundColor = filterColor;
        document.querySelector('body').appendChild(div);
    });
}
let minZoom = 1;
let currZoom = 1;
let maxZoom = 3;
zoom_in.addEventListener("click", (e) => {

    if (currZoom < maxZoom) {
        currZoom = currZoom + 0.1;
    }
    video.style.transform = `scale(${currZoom})`;

});
zoom_out.addEventListener("click", (e) => {

    if (currZoom > minZoom) {
        currZoom -= 0.1;
    }
    video.style.transform = `scale(${currZoom})`;


});


let isRecording = false;
Start.addEventListener("click", (e) => {
    if (isRecording) {
        recordDiv.classList.remove("record-animation");
        isRecording = false;
        mediaRecorder.stop();

    }
    else {
        filterColor = "";
        removeFilter();
        recordDiv.classList.add("record-animation");
        isRecording = true;
        mediaRecorder.start();
    }

});

// camera capture
capture.addEventListener("click", (e) => {

    if (isRecording) {
        return;
    }
    captureDiv.classList.add("capture-animation");

    setTimeout(() => {
        captureDiv.classList.remove("capture-animation");
    }, 1000);
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoWidth;
    let ctx = canvas.getContext("2d");

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(currZoom, currZoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(video, 0, 0);

    if (filterColor) {
        ctx.fillStyle = filterColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    let link = canvas.toDataURL();
    addMedia(link,"image");
    // let a = document.createElement('a');
    // a.href = link;
    // a.download = "img.png";
    // a.click();
    // a.remove();


});
let chunk = [];
let mediaRecorder;
// video Recorder
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
    console.log(mediaStream);
    video.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable", (e) => {
        chunk.push(e.data);
    });
    mediaRecorder.addEventListener("stop", (e) => {
        let blob = new Blob(chunk, { type: "video/mp4" });
        chunk = [];
        addMedia(blob,"video");
        // let url = window.URL.createObjectURL(blob);
        // let a = document.createElement("a");
        // a.href = url;
        // a.download = "video.mp4";
        // a.click();
        // a.remove();

    });

}).catch((err) => {
    console.log(err);
});