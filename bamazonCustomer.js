var inquirer = require("inquirer")
var mysql = require("mysql")
var chalk = require("chalk")
var Table = require("cli-table3");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if(err) throw err;
    display();
})

function userPrompt(){
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        if (err) throw err;
    inquirer.prompt([
        {
            name: "buy",
            type: "input",
            message: "Enter the Item ID of the product you would like to buy:",
            validate: function(value) {
                if (isNaN(value) === false){
                    for (let i = 0; i < res.length; i++) {
                        if (value != res[i]){
                            return true;
                        }                      
                    }

                }
                return false;
            }
        },
        {
            name: "quant",
            type: "input",
            message: "How many units of this product would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        var choiceProduct = parseInt(answer.buy);
        var quantity = parseInt(answer.quant);
        for (let i = 0; i<res.length; i++){
            if (choiceProduct === res[i].item_id){
                choiceProduct = res[i]
            } 
        }
        if (choiceProduct.stock_quantity > quantity){
            var newValue = (choiceProduct.stock_quantity - quantity)
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newValue
                    },
                    {
                        item_id: choiceProduct.item_id
                    }
                ],
                function(err) {
                    if (err) throw err;
                    console.log(chalk.green("Item successfully purchased, your total is " + (choiceProduct.price * quantity) + " dollars."))
                    display();
                }
            )
        }
        else{
            console.log(chalk.red("We don't have enough stock!"))
            display();
        }
    });
    });
}
function display() {
    var table = new Table({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
        head: ['Item ID', 'Product', 'Department', 'Price', 'Quantity Left']
      });    
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            var prod = res[i];
            var id = prod.item_id;
            var name = prod.product_name;
            var dep = prod.department_name;
            var price = prod.price;
            var stock = prod.stock_quantity
            table.push([id, name, dep, price, stock]);
        }
        console.log(table.toString());
        userPrompt();
    });
}
