//CHALLENGE #1: CUSTOMER 

var inquirer = require("inquirer");
var mysql = require("mysql");

//use mysql to make connection variable with appropriate info
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon_db"
});

//Connect to the bamazon database
connection.connect(function(err) {
  if (err) throw err;
  
  console.log("\nWelcome to the Bamazon Store!\n");
  customerApp();
});

// customerApp is called once the connection with the database is made
function customerApp(){
    //Create an empty array so we can store the formatted query results (setting this array variable allows us to validate the users ID input below)
    var arr = [];
    //Select all the information from the products table to show the customer their options
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;

        console.log("\nInventory for sale: \n==========================================");
        //Loop through the results of the product query and push the formatted information to the arr array
        for(var i = 0; i < res.length; i++){
            arr.push("\nItem: " + res[i].product_name +  "\nID: " + res[i].item_id + "\nDepartment: " + res[i].department_name + "\nPrice: $" + res[i].price + "\n\n---------------------------\n");
        }
        //Log the the products for customer review
        console.log(arr.join("") + "\n==========================================\n");
        
        //Ask the customer what product and how much of it they'd like
        inquirer.prompt([
        {
           name : "choice",
           message : "Please enter the ID number of the item you'd like to purchase: ",
           validate : function(value){
               if (!isNaN(value) && value>0 && value<=arr.length){ //Ensure the user is submitting a valid id: must be a number greater than zero and less than or equal to the arr array's length (the length of the array === the max ID number)
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
            //Get the product information for the selected item the customer wants
            connection.query("SELECT * FROM products WHERE item_id=?", [parseInt(answers.choice)], function(err, result){
                if (err) throw err;
                //If the stocked quantity is sufficient to fill the customers request
                if(answers.quantity <= result[0].stock_quantity){
                    //Update the selected product
                    connection.query("UPDATE products SET ? WHERE ?", 
                        [{
                            stock_quantity: (result[0].stock_quantity - answers.quantity),//use stock quantity from the selected item query result
                            number_sold: (result[0].number_sold + parseInt(answers.quantity)),//use number sold from the selected item query result
                            revenue: ((parseInt(answers.quantity) + result[0].number_sold) * result[0].price)//revenue will be the total items sold * the price
                        },
                        {
                           item_id: answers.choice 
                        }], 
                    function(err, result){
                        if(err) throw err;
                        //Log successful completion
                        console.log("\nTransaction Completed! \nPurchase Total: $" + (parseInt(answers.quantity) * res[0].price).toFixed(2) + "\nEnjoy your new " + res[0].product_name + "!\n");
                        //Ask if the customer would like to make another purchase
                        inquirer.prompt([
                            {
                                type : "confirm",
                                name : "another",
                                message : "Would you like to make another transaction?",
                                default: true
                            }
                        ]).then(function(answers){
                            //if the customer wants to make another purchase
                            if(answers.another){
                                //run the customerApp again so they can see selection and make choice
                                customerApp();
                            }
                            //if the customer is finished, say goodbye and end the connection
                            else{
                                console.log("\nThank you for stopping by. Come back soon!\n");
                                connection.end();
                            }
                        });
                    });
                }
                //If the customer wants to buy more items than are available
                else{
                    //Tell them how many items are remaining in case they want to purchase what is left
                    console.log("\nInsufficient quantity. There are " + result[0].stock_quantity + " of this item remaining.\n");
                    //Ask if they would like to make another transaction
                    inquirer.prompt([
                        {
                            type : "confirm",
                            name : "tryAgain",
                            message : "Would you like to try a different transaction?",
                            default: true
                        }
                    ]).then(function(answers){
                        //If the customer would like to try again run the customerApp to take them to the beginning
                        if(answers.tryAgain){
                            customerApp();
                        }
                        //If the customer is finished, end the connection
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