let uploadForm = document.getElementById('uploadForm');
let bookFile = document.getElementById('bookFile');
let previewImg = document.getElementById('previewImg');
let check = false;

let bookshelfId = "";
bookFile.addEventListener('change', (e) => {
    let file = bookFile.files[0];
    console.log(file);
    if ((file.size / (1024 ** 2)) > 5) {
        alert("Do not upload more than 5MB")
        return;
    }
    if (file.type === 'application/pdf' | file.type.indexOf('image') != -1) {
        if (file.type.indexOf('image') != -1) {
            let reader = new FileReader();
            reader.onload = function () {
                previewImg.src = reader.result;
            }
            reader.readAsDataURL(file);
        }
        check = true;
    } else {
        check = false;
        alert("Format is not allowed");
        return;
    }
})
let ck = false;
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(uploadForm.category.value.toLowerCase() == "horror")
    {
        bookshelfId = "QZHSd0JORVohAuv3xXfB";
    }
    else if (uploadForm.category.value.toLowerCase() == "comic")
    {
        bookshelfId = "RPC8GQIZL3ayOldnLbAI";
    }
    else if (uploadForm.category.value.toLowerCase() == "novel")
    {
        bookshelfId = "TbSgSxfzLCz5W5JC6NA7";
    }
    else if (uploadForm.category.value.toLowerCase() == "vietnamese literature")
    {
        bookshelfId = "X5CSAHdyjHtaBC1yAqSz";
    }
    else if (uploadForm.category.value.toLowerCase() == "romantic")
    {
        bookshelfId = "bA3PyvU5VClJGMPnBZnE";
    }
    else if (uploadForm.category.value.toLowerCase() == "comedy")
    {
        bookshelfId = "fzujksHEpmgkF8PsGRbr";
    }else{return;}

    let file = bookFile.files[0];
    console.log(file.name);
    let storageRef = firebase.storage().ref();
    let thisRef = storageRef.child(file.name);
    let url;
    try {
        await thisRef.put(file);
        url = await thisRef.getDownloadURL();
        console.log(url);
    } catch (error) {
        // alert("An error occurred");
        console.log(error);
    }

    await firebase.firestore().collection('books').add({
        author: uploadForm.author.value.trim(),
        bookshelfId: bookshelfId,
        name: uploadForm.name.value.trim(),
        price: uploadForm.price.value.trim(),
        pulishedDate: uploadForm.date.value.trim(),
        source: url
    })

    window.location.assign("index.html"); 
})

