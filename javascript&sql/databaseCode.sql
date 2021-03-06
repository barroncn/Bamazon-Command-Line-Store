-- Create Bamazon Database --

DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id MEDIUMINT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (100),
    department_name VARCHAR (100),
    price DECIMAL (10,2),
    stock_quantity TINYINT DEFAULT 0,
    number_sold INTEGER (10) DEFAULT 0,
    revenue DECIMAL (10,2) DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments(
    department_id MEDIUMINT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR (100),
    over_head_costs DECIMAL(10,2),
    revenue DECIMAL (10,2) DEFAULT 0,
    PRIMARY KEY (department_id)
);

-- Add Departments to departments table --
INSERT INTO departments (department_name, over_head_costs)
VALUE("Women's Clothing", 300);
INSERT INTO departments (department_name, over_head_costs)
VALUE("Men's Clothing", 300);
INSERT INTO departments (department_name, over_head_costs)
VALUE("Garden", 245);
INSERT INTO departments (department_name, over_head_costs)
VALUE("Games", 150);


-- Add Products to products table --

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Blouse", "Women's Clothing", 24.95, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Men's Buttondown", "Men's Clothing", 29.95, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Jeans", "Women's Clothing", 48.98, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Jeans", "Men's Clothing", 43.98, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Scarf", "Women's Clothing", 19.95, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Scarf", "Men's Clothing", 19.95, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Socks", "Women's Clothing", 4.95, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Socks", "Men's Clothing", 4.95, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Hoe", "Garden", 15.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Rake", "Garden", 16.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Pretty Shrubs", "Garden", 21.99, 14);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Pavers", "Garden", 2.99, 70);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Flowers", "Garden", 12.00, 14);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Monopoly", "Games", 30.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Scrabble", "Games", 31.00, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Charades", "Games", 29.00, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Cards Against Humanity", "Games", 35.00, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Poker Chips", "Games", 0.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Playing Cards", "Games", 4.99, 16);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Crossword Puzzle Book", "Games", 2.99, 20);