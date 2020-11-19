let root = null;
let useHash = true;
let hash = "#";
let router = new Navigo(root, useHash, hash)

function reload() {
    let url = localStorage.getItem("source");
    return url;
}

const $flipBook = $(document.getElementById('flipbook'));
const $modal = document.getElementById("modal");
const $close = document.getElementsByClassName("close")[0];
const $modal1 = document.getElementById("modal1");


router.on('/flipbook', async () => {

    $modal1.style.display = "block";
   let check = await showFlipBook();
   if(check == true) {
       $modal1.style.display = "none";
       $modal.style.display = "block";
   }

    $close.onclick = () => {
        $modal.style.display = "none";
        window.location.replace("index.html");
        localStorage.clear();
    }
}).resolve();




async function showFlipBook() {
    var link = reload();
    var loadingTask = await pdfjsLib.getDocument(link);
   await loadingTask.promise.then(async (pdf) => {
        console.log('PDF loaded');

        for (let i = 1; i < pdf.numPages; i++) {
            await loadFile(pdf, i);
        }

        await $("#flipbook").turn({
            width: 1200,
            height: 900,
            autoCenter: true
        });
    })
    return true;
}


async function loadFile(pdf, i) {
    await pdf.getPage(i).then((page) => {
        var scale = 0.7;
        var viewport = page.getViewport({ scale: scale });

        //Create element
        // Prepare canvas using PDF page dimensions
        let canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
            console.log('Page rendered');
        });
        $flipBook.append($(canvas));
    });
}




window.router = router;