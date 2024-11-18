const express = require("express");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");
const path = require('path'); 
const dbo = require('./db');

const app = express();

// Configure Handlebars as the view engine
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: 'views/',
    defaultLayout: 'main',
    extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', 'views');


const demo =app.use('/assets', express.static(path.join(__dirname, 'assets/img')));

console.log(demo);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root route to fetch and display products
app.get('/', async (req, res) => {
    try {
        let database = await dbo.getDatabase();
        const collection = database.collection('products');
        const cursor = collection.find({});
        let employee = await cursor.toArray();

        let message = '';
        switch (req.query.status) {
            case '1':
                message = 'Inserted successfully!';
                break;
            default:
                break;
        }

        res.render('main', { message, employee });
    } catch (error) {
        console.error('Error in GET /:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
});

// Insert product route
app.post('/insert_product', async (req, res) => {
    try {
        let database = await dbo.getDatabase();
        const collection = database.collection('products');
        const product = {
            name: req.body.Pname,
            price: req.body.price,
            type: req.body.type,
        };

        await collection.insertOne(product);
        res.redirect('/?status=1');
    } catch (error) {
        console.error('Error in POST /insert_product:', error);
        res.status(500).send('An error occurred while inserting the product.');
    }
});

// Start the server
app.listen(9000, () => {
    console.log("Listening on port 9000");
});
