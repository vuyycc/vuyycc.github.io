export function getSource(src) {
    return src;
}


const $template = document.getElementById('book-template');

class Book extends HTMLElement {
    name = '';
    author = '';
    price = '';
    source = '';
    pusblishedDate = '';
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));
        this.$canvas = $(this.shadowRoot.getElementById("the-canvas"));
        this.$cv = this.shadowRoot.getElementById("the-canvas");

        this.$cv.addEventListener('click',(e) => {
            localStorage.setItem("source",this.source);
            e.preventDefault();
            window.location.replace("index.html#/flipbook");
        })
    }

    static get observedAttributes() {
        return ['name', 'author', 'price', 'source','pusblishedDate'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name == "source"){
            this.loadPDF();
            this.source = newValue;
        }else if(name == 'name'){
            this.name = newValue;
        }else if(name == 'price') {
            this.price = newValue;
        }else if(name == 'author') {
            this.author = newValue;
        } else if (name == 'pusblishedDate') {
            this.pusblishedDate = newValue;
        }
    }

    async loadPDF() {
        let loadingUrl = await pdfjsLib.getDocument(this.getAttribute('source'));
        loadingUrl.promise.then( async (pdf) => {

            await pdf.getPage(1).then((page) => {
                var scale = 1;
                var viewport = page.getViewport({scale: scale});

                
                let pageCanvas = document.createElement('canvas');
                var context = pageCanvas.getContext('2d');
                pageCanvas.height = viewport.height;
                pageCanvas.width = viewport.width;

                var renderTask = page.render({canvasContext: context, viewport: viewport});
                renderTask.promise.then( () => {
                });
                this.$canvas.append($(pageCanvas));
            })

        })
    }

    // sendSrc() {
    //     let sendSc = new CustomEvent('send-src', {
    //         bubbles: true,
    //         detail: {
    //             id: this.source,
    //         }
    //     });

    //     // phát update-task-event
    //     this.dispatchEvent(sendSc);
    // }
}

window.customElements.define('book-img',Book);