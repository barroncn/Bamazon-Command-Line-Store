// Challenge #2: Manager View
var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("\nWelcome to the Bamazon Store!\n");
  managerApp();
});

function managerApp(){
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
        if(answers.list === "view"){
            viewInventory();
        }
        else if(answers.list === "low"){
            viewLow();
        }
        else if(answers.list === "add"){
            addInv();
        }
        else{
            addNew();
        }
    });
}

//If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function viewInventory(){
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        console.log("\nCurrent Inventory:\n==========================");
        for(var i = 0; i < res.length; i++){
            console.log("\nID: " + res[i].item_id + "\nName: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n\n----------------------") 
        }
        anythingElse();
    });
}

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLow(){
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE (stock_quantity < 5)", function(err, res){
        if (err) throw err;
        console.log("\nLow Inventory:\n==========================");
        for(var i = 0; i < res.length; i++){
            console.log("\nID: " + res[i].item_id + "\nName: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n\n----------------------") 
        }
        inquirer.prompt([
            {
                type : "confirm",
                name : "confirm",
                message : "Would you like to add inventory right now?",
                default : false
            }
        ]).then(function(answers){
            if(answers.confirm){
                addInv();
            }
            else{
                anythingElse();
            }
        });
    });
}

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
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
        connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [answers.ID], function(err,res){
            if (err) throw err;
            connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity : (res[0].stock_quantity += parseInt(answers.quant))}, {item_id : parseInt(answers.ID)}], function(err, res){
                if(err) throw err;
                console.log("You have added " + answers.quant + " units to Item #" + answers.ID + "'s inventory");
                anythingElse();
            });
        });
    });
}

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addNew(){
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
        connection.query("INSERT INTO products SET ?",
        {
         product_name : answers.name,
         department_name : answers.dept,
         price: parseFloat(answers.price),
         stock_quantity : parseInt(answers.stock)
        },function(err,res){
            if (err) throw err;
            console.log("You have successfully added '" + answers.name + "' to the " + answers.dept + " department!");
            anythingElse();
        });
    });
}

//Asks if the manager would like to do anything else. If not, ends connection
function anythingElse(){
    inquirer.prompt([
        {
           type : "confirm",
           name : "confirm",
           message : "Would you like to make further inquiries?",
           default : true
        }
    ]).then(function(answers){
        if(answers.confirm){
            managerApp();
        }
        else{
            console.log("\nHave a nice day!\n");
            connection.end();
        }
    });
}