DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sunglasses", "Outdoor-Wear", "19.99", "200");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Office", "899.99", "80");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "Audio", "20.99", "120");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Coffee Beans", "Grocery", "16.99", "250");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Record Player", "Audio", "89.99", "160");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Printer", "Office", "120.99", "25");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Backpack", "School", "44.99", "160");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playstation 4", "Gaming", "299.99", "18");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apples", "Grocery", "4.99", "250");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jacket", "Outdoor-Wear", "55.99", "130");

SELECT * FROM products;
