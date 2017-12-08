//CHALLENGE #2: MANAGER

var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon_db"
});

//Connect with the mysql database
connection.connect(function(err) {
  if (err) throw err;
  
  console.log("\nWelcome to the Bamazon Store!\n");
  managerApp();
});

//Once the connection has been made, the managerApp is called
function managerApp(){
    //Manager selects from a list of options
    inquirer.prompt([
        {
           type : "list",
           name : "list",
           message : "What would you like to do?",
           choices : [
                        {value:"view", name: "View products for sale"},
                        {value:"low", name: "View low inventory"},
                        {value:"add", name: "Add to inventory"},
                        {value:"new", name: "Add a new product"}
                     ]
        }
    ]).then(function(answers){
        //Depending on the users choice, the correct function is called
        var userChoice = answers.list;
        
        switch(userChoice){
            
            case "view" : return viewInventory();
            
            case "low" : return viewLow();
            
            case "add" : return addInv();
            
            case "new" : return addNew();
        }
    });
}

//If a manager selects View Products for Sale, the app lists every available item: the item IDs, names, prices, and quantities.
function viewInventory(){
    //Query the database for the item id, name, department, price and stock quantity
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        
        console.log("\nCurrent Inventory:\n==========================");
        //Loop through the results to log formatted results to the console
        for(var i = 0; i < res.length; i++){
            console.log("\nID: " + res[i].item_id + "\nName: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n\n----------------------"); 
        }
        //Ask if they'd like to make any other inquiries
        anythingElse();
    });
}

// If a manager selects View Low Inventory, then it lists all items with an inventory count lower than five.
function viewLow(){
    //Qery the database for item information where the stock quantity is below 5
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE (stock_quantity < 5)", function(err, res){
        if (err) throw err;
        
        console.log("\nLow Inventory:\n==========================");
        //Loop through the results to log formatted results to the console
        for(var i = 0; i < res.length; i++){
            console.log("\nID: " + res[i].item_id + "\nName: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n\n----------------------"); 
        }
        //Go ahead and ask if they'd like to add inventory (since they're looking at low stock this is the next logical step)
        inquirer.prompt([
            {
                type : "confirm",
                name : "confirm",
                message : "Would you like to add inventory right now?",
                default : false
            }
        ]).then(function(answers){
            //If the manager would like to add inventory, run addInv()
            if(answers.confirm){
                addInv();
            }
            else{
            //If the user doesn't want to add inventory, make sure there isn't another inqiury they'd like to make
                anythingElse();
            }
        });
    });
}

// If a manager selects Add to Inventory, the app displays a prompt that will let the manager "add more" of any item currently in the store.
function addInv(){
    inquirer.prompt([
            {
               name : "ID",
               message : "Please enter the ID of the item you are adding: "
            },
            {
                name : "quant",
                message : "How many units are you adding?"
            }
    ]).then(function(answers){
        //Query the database for the stock quantity of the item they'd like to add
        connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [answers.ID], function(err,res){
            if (err) throw err;
            
            //Update the stock quantity with the quantity provided by the user
            connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity : (res[0].stock_quantity + parseInt(answers.quant))}, {item_id : parseInt(answers.ID)}], function(err, res){
                if(err) throw err;
                
                //Log a successful update
                console.log("You have added " + answers.quant + " units to Item #" + answers.ID + "'s inventory");
                //Ask if there are any other transactions they'd like to make
                anythingElse();
            });
        });
    });
}

// If a manager selects Add New Product, the manager can add a completely new product to the store.
function addNew(){
    //Get the required information to create a new column in the product table (item name, department, price, stock quantity)
    inquirer.prompt([
        {
         name : "name",
         message : "What is the new item's name?"
        },
        {
         name : "dept",
         message : "In which department will the new item be listed?"
        },
        {
         name : "price",
         message : "What is the new item's price?"
        },
        {
         name : "stock",
         message : "How many units are you adding?"
        }
        
    ]).then(function(answers){
        //Query the database to insert thenew item into the products table
        connection.query("INSERT INTO products SET ?",
        {
            //Set the new product information to what the user input
            product_name : answers.name,
            department_name : answers.dept,
            price: parseFloat(answers.price),
            stock_quantity : parseInt(answers.stock)
            
        },function(err,res){
            if (err) throw err;
            
            //Log a successful update
            console.log("You have successfully added '" + answers.name + "' to the " + answers.dept + " department!");
            //Ask if the user would like to make any other inquiries
            anythingElse();
        });
    });
}

//Asks if the manager would like to do anything else.
function anythingElse(){
    inquirer.prompt([
        {
           type : "confirm",
           name : "confirm",
           message : "Would you like to make further inquiries?",
           default : true
        }
    ]).then(function(answers){
        //If so, run the managerApp again
        if(answers.confirm){
            managerApp();
        }
        // If not, end connection
        else{
            console.log("\nHave a nice day!\n");
            connection.end();
        }
    });
}