const $template = document.getElementById("book-shelf-template");
document.addEventListener('DOMContentLoaded', e => {
    document.body.addEventListener('click', e => {
        console.log(e.path[1]);
    }, false);
}, false);

class BookShelf extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$category = this.shadowRoot.getElementById("cate");
        this.$books = this.shadowRoot.getElementById("bs-body"); 

        this.render();


    }
    static get observedAttributes() {
        return ['category'];
    }

    attributeChangedCallback(name, oldValue, newValue){
        if(name == 'category') {
            this.$category.innerHTML = newValue;
        }
    }

    async render() {
        let arrBook = [];
        let result = await firebase.firestore().collection('books').where("bookshelfId", "==", this.getAttribute("idB")).get();
        for (let i = 0; i < result.docs.length; i++) {
            itBook(this.$books);
            async function itBook(a) {
                let rs = await firebase.firestore().collection('books').doc(result.docs[i].id).get();
                // arrBook.push(rs.data());
                // console.log(arrBook);
                var book = rs.data();
                var endStr = book.source.substring(73);
                var url = "http://localhost:8010/proxy" + endStr;
                a.innerHTML += `
                <book-img
                name="${book.name}"
                author="${book.author}"
                price="${book.price}"
                pusblishedDate="${book.pusblishedDate}"
                source="${url}">
                </book-img>`;
            }
            this.$books;
        }
    }
}

window.customElements.define('book-shelf',BookShelf);   