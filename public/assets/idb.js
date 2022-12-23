// create varioable to hold db connection
let db; 

//establish connection to IndexedDB database called 'topperPizza' and set version to 1
const request = indexedDB.open('toppersPizza', 1);

//this event will emit if the database version change (nonexistent to V1, to V2, etc.)
request.onupgradeneeded = function(event){
    //save reference to db
    const db = event.target.result; 
    
    //create object array store (table) called 'new_pizza' and set it to have autoincrement primary key
    db.createObjectStore('new_pizza', { autoIncrement: true});
};

//upon success
request.onsuccess = function(event){
    //when db is successfully created with its object store (from onupgradeneeded event above) or 
    //simply established a connection, save reference to db in global variable
    db = event.target.result; 

    //check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine){
    uploadPizza()
    }
};

request.onerror = function(event){
    //log error here
    console.log(event.target.errorCode);
};

//will execute if we attempt to submit a pizza with no internet connection
function saveRecord(record){
    //open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the objectStore for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to your store with add method
    pizzaObjectStore.add(record)
}

function uploadPizza(){
    //open a transaction on db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll(); 

    //upon successful .getAll()0 execution, run this fxn
    getAll.onsuccess = function(){
        //if there was data in the indexedDB store, send it to api server
        if (getAll.result.length > 0){
            fetch('/api/pizzas', {
                method: 'POST', 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message){
                    throw new Error (serverResponse);
                }
                //open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                //access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                //clear all items in your store
                pizzaObjectStore.clear();

                alert('All pizzas have been saved and submitted');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}

//listen to app coming back online
window.addEventListener('online', uploadPizza);