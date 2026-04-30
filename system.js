let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let mood = 'create';
let tmp;



// get total
function getTotal(){
    if(price.value != ''){
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value ;
        total.innerHTML = result ;
        total.style.background = '#059669';
    }
    else{
        total.innerHTML = '';
        total.style.background = 'red';
    }
}
// create product
// save localStorage
let dataPro;
if(localStorage.product != null){
    dataPro = JSON.parse(localStorage.product);
}
else{
    dataPro = [];
}
submit.onclick = function(){
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    }
    // count, update mood
    if(title.value != '' && price.value != '' && category.value != '' && newPro.count < 101){
        if(mood === 'create'){
            if(newPro.count > 1){
            for(let i = 0; i < newPro.count; i++){
                dataPro.push(newPro);
             }
        } 
        else{
            dataPro.push(newPro);
            clearData()
        }
    }
    else{
        dataPro[tmp] = newPro;
        mood = 'create';
        submit.innerHTML = 'create';
        count.style.display = 'block';
    }
    clearData()
    }
    // save localStorage
    localStorage.setItem('product', JSON.stringify(dataPro))
    showData()
    updateStats();
}
// clear inputs
function clearData(){
    title.value ='';
    price.value ='';
    taxes.value ='';
    ads.value ='';
    discount.value ='';
    total.innerHTML ='';
    count.value ='';
    category.value ='';
}
// read
function showData(){
    let table = '';
    for(let i = 0; i < dataPro.length; i++){
        table += `
        <tr>
            <td>${i+1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">update</button></td>
            <td><button  onclick='deleteData(${i})' id="delete">delete</button></td>
        </tr>
        `;
        getTotal()
    }
    document.getElementById('tbody').innerHTML = table;
    // delete all
    let btnDelete = document.getElementById('deleteAll')
    if(dataPro.length > 0){
        btnDelete.innerHTML = `
        <button onclick="deleteAll()">delete all (${dataPro.length})</button>
        `
    }
    else{
         btnDelete.innerHTML = '';
    }
}
// Delete All Products with Confirmation 
function deleteAll() {
    // Show a confirmation dialog before wiping the entire database
    if (confirm("CRITICAL: This will delete ALL your products. Are you sure?")) {
        // Clear the array and local storage
        localStorage.clear();
        dataPro.splice(0);
        showData();
         // Reset dashboard numbers to zero
        updateStats();
    }
}
showData()
// delete
// Modified delete function with confirmation
function deleteData(i) {
    // Show confirmation dialog before deleting
    if (confirm("Are you sure you want to delete this product?")) {
        dataPro.splice(i, 1);
        localStorage.product = JSON.stringify(dataPro);
        showData();
        // Update stats after deletion
        updateStats(); 
    }
}
// update
function updateData(i){
    title.value = dataPro[i].title
    price.value = dataPro[i].price
    taxes.value = dataPro[i].taxes
    ads.value = dataPro[i].ads
    discount.value = dataPro[i].discount
    getTotal()
    count.style.display = 'none';
    category.value = dataPro[i].category
    submit.innerHTML = 'update';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: "smooth",
    })
}
// search
let searchMood = 'title';
function getSearchMood(id){
    let search = document.getElementById('search');
    if(id == 'searchTitle'){
        searchMood = 'title';
    }
    else{
        searchMood = 'category';
    }
    search.placeholder = 'search by '+ searchMood;
    search.focus()
    search.value = '';
    showData()
}
function searchData(value){
    let table = '';
    if(searchMood == 'title'){
       for(let i = 0; i < dataPro.length; i++){
        if(dataPro[i].title.toLowerCase().includes(value.toLowerCase())){
            table += `
            <tr>
                <td>${i+1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button onclick="updateData(${i})" id="update">update</button></td>
                <td><button  onclick='deleteData(${i})' id="delete">delete</button></td>
            </tr>
            `;
        }
       } 
    }
    else{
        for(let i = 0; i < dataPro.length; i++){
        if(dataPro[i].category.toLowerCase().includes(value.toLowerCase())){
            table += `
            <tr>
                <td>${i+1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].taxes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button onclick="updateData(${i})" id="update">update</button></td>
                <td><button  onclick='deleteData(${i})' id="delete">delete</button></td>
            </tr>
            `;
        }
       } 
    }
    document.getElementById('tbody').innerHTML = table;
}

// Function to update the dashboard stats
function updateStats() {
    let totalValue = 0;
    // Loop through array to calculate total value of all products
    for (let i = 0; i < dataPro.length; i++) {
        totalValue += Number(dataPro[i].total);
    }
    
    // Update the DOM elements
    document.getElementById('stats-count').innerHTML = dataPro.length;
    document.getElementById('stats-value').innerHTML = totalValue.toLocaleString() + '$';
}

// Call stats update on every page load
// updateStats
updateStats();

