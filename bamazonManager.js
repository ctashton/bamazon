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

connection.connect(function (err) {
    if (err) throw err;
    options();
})

function options() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "Would you like to [VIEW PRODUCTS], [CHECK LOW INVENTORY], [ADD TO INVENTORY], or [ADD NEW PRODUCT]:",
        choices: ["VIEW PRODUCTS", "CHECK LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT"]
    })
        .then(function (answer) {
            switch (answer.options) {
                case "VIEW PRODUCTS":
                    viewProducts();
                    break;
                case "CHECK LOW INVENTORY":
                    checkInv();
                    break;
                case "ADD TO INVENTORY":
                    addInv();
                    break;
                case "ADD NEW PRODUCT":
                    newProd();
                    break;
            }
        })
}

function viewProducts() {
    console.log("Viewing Products")
    var table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        head: ['Item ID', 'Product', 'Price', 'Quantity Left']
    });
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res, ) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            var prod = res[i];
            var id = prod.item_id;
            var name = prod.product_name;
            var price = prod.price;
            var stock = prod.stock_quantity
            table.push([id, name, price, stock]);
        }
        console.log(table.toString());
        options();
    });
}

function checkInv() {
    console.log("Checking Inventory")
    var table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        head: ['Item ID', 'Product', 'Quantity Left']
    });
    connection.query("SELECT * FROM products", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            var prod = res[i];
            var id = prod.item_id;
            var name = prod.product_name;
            var stock = prod.stock_quantity
            if (stock < 5) {
                table.push([id, name, stock]);
            }
        }
        console.log(table.toString());
        options();

    })

}
function addInv() {
    var table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        head: ['Item ID', 'Product', 'Department', 'Price', 'Quantity Left']
    });
    var query = "SELECT * FROM products"
    connection.query(query, function (err, res) {
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
        inquirer.prompt([
            {
                name: "add",
                type: "input",
                message: "Enter the Item ID of the product you would like to add inventory for:",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        for (let i = 0; i < res.length; i++) {
                            if (value != res[i]) {
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
                message: "How many units of this product would you like to add to the stock?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
            .then(function (answer) {
                var choiceProduct = parseInt(answer.add);
                var quantity = parseInt(answer.quant);
                for (let i = 0; i < res.length; i++) {
                    if (choiceProduct === res[i].item_id) {
                        choiceProduct = res[i]
                    }
                }
                var newValue = (choiceProduct.stock_quantity + quantity)
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
                    function (err) {
                        if (err) throw err;
                        console.log(chalk.green("Item successfully added, your inventory total is " + newValue))
                        options();
                    }
                )


                console.log(chalk.red("Adding to Inventory"))
            })
    });
}
function newProd() {
            console.log("Adding a new product")
            inquirer.prompt([
                {
                    name: "name",
                    type: "input",
                    message: "Enter the name of the product you would like to add:"
                },
                {
                    name: "dpt",
                    type: "input",
                    message: "What department does the product belong in?"
                },
                {
                    name: "price",
                    type: "number",
                    message: "How much does the item cost?",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                },
                {
                    name: "stock",
                    type: "number",
                    message: "How much of this product is in stock?",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                }
            ]).then(function(answer) {
                connection.query(
                    "INSERT INTO products SET ?",
                    [{
                        product_name: answer.name,
                        department_name: answer.dpt,
                        price: answer.price,
                        stock_quantity: answer.stock
                    }],
                    function(err, res){
                        if (err) throw err;
                        console.log(chalk.green(res.affectedRows + " Product Added!"))
                        options();
                    }
                )

            })
        }