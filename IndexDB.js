let db;

let req = indexedDB.open("Camera", 1);

req.addEventListener("success", () => {
  db = req.result;
});

req.addEventListener("upgradeneeded", () => {
  db = req.result;
  db.createObjectStore("Gallery", { keyPath: "mID" });
});
req.addEventListener("error", () => {
  console.log("error");
});

function addMedia(media, type) {
  if (!db) {
    return;
  }

  let obj = { mID: Date.now(), media, type };

  let tx = db.transaction("Gallery", "readwrite");

  let gallery = tx.objectStore("Gallery");

  gallery.add(obj);
}

function viewMedia() {
  if (!db) {
    return;
  }

  let tx = db.transaction("Gallery", "readonly");

  let gallery = tx.objectStore("Gallery");
  let cReq = gallery.openCursor();
  cReq.addEventListener("success", () => {
    let cursor = cReq.result;
    if (cursor) {
      console.log(cursor.value);
      let mo = cursor.value;
      addcontainer(mo.media, mo.type, mo.mID);

      cursor.continue();
    }
  });
}

function addcontainer(media, type, id) {
  let div = document.createElement("div");
  div.classList.add("media-container");
  if (type == "image") {
    div.innerHTML = `
    <div class="media"><img src="${media}" > </div>
    <button class="Dld">Download</button>
    <button class="Dlt">Delete</button>`;
  } else {
    let url = window.URL.createObjectURL(media);
    div.innerHTML = `
        <div class="media"><video src="${url}" autoplay muted loop controls></video> </div>
        <button class="Dld">Download</button>
        <button class="Dlt" data-id=${id}>Delete</button>`;
  }

  let downloadBtn = div.querySelector(".Dld");
  downloadBtn.addEventListener("click", () => {});

  document.querySelector("body").append(div);
}
