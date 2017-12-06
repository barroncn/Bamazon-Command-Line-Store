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
  runApp();
});

function runApp(){
    var arr = [];
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.log("\nInventory for sale: \n==========================================")
        for(var i = 0; i < res.length; i++){
            arr.push("\nItem: " + res[i].product_name +  "\nID: " + res[i].item_id + "\nDepartment: " + res[i].department_name + "\nPrice: $" + res[i].price + "\n\n---------------------------\n");
        }
        console.log(arr.join("") + "\n==========================================\n");
        inquirer.prompt([
        {
           name : "choice",
           message : "Please enter the ID number of the item you'd like to purchase: ",
           validate : function(value){
               if (!isNaN(value) && value>0 && value<=arr.length){
                   return true;
               }
               else{
                   return false;
               }
           }
        },
        {
            name: "quantity",
            message: "How many would you like to buy?"
        }
        ]).then(function(answers){
            connection.query("SELECT * FROM products WHERE item_id=?", [parseInt(answers.choice)], function(err, res){
                if (err) throw err;
                if(answers.quantity <= res[0].stock_quantity){
                    connection.query("UPDATE products SET ? WHERE ?", 
                    [
                        {
                            stock_quantity: (res[0].stock_quantity - answers.quantity),
                            number_sold: (res[0].number_sold + parseInt(answers.quantity)),
                            revenue: (answers.quantity * res[0].price)
                        },
                        {
                           item_id: answers.choice 
                        }
                    ], 
                    function(err, result){
                        if(err) throw err;
                        console.log("\nTransaction Completed! \nPurchase Total: $" + (parseInt(answers.quantity) * res[0].price) + "\nEnjoy your new " + res[0].product_name + "!\n");
                        inquirer.prompt([
                        {
                            type : "confirm",
                            name : "tryAgain",
                            message : "Would you like to make another transaction?",
                            default: true
                        }
                ]).then(function(answers){
                    if(answers.tryAgain){
                        runApp();
                    }
                    else{
                        console.log("\nThank you for stopping by. Come back soon!\n");
                        connection.end();
                    }
                });
                    });
                }
                else{
                    console.log("\nInsufficient quantity. There are " + res[0].stock_quantity + " of this item remaining.\n");
                    inquirer.prompt([
                        {
                            type : "confirm",
                            name : "tryAgain",
                            message : "Would you like to try a different transaction?",
                            default: true
                        }
                ]).then(function(answers){
                    if(answers.tryAgain){
                        runApp();
                    }
                    else{
                        console.log("\nThank you for stopping by. Come back soon!\n");
                        connection.end();
                    }
                });
                }
                
            });
        });
    });
}