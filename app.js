const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes =  require('./api/routes/user');

mongoose.connect('mongodb+srv://oladipo:' + 
process.env.MONGO_ATLAS_PW + 
'@node-rest-shop.0kmryac.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop'/*{
    useMongoClient: true
}*/
);
mongoose.Promise = global.Promise; 

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to Node Rest Shop!');
});

const options = {
    definition: {
        openapi : '3.0.0',
        info:{
            title: 'Node Rest Shop',
            version: '1.0.0'
        },
        servers:[
            {
                url: 'http://localhost:3000/'
            }
        ],
        components: {
            securitySchemes: {
                JWTBearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }  
    },
    apis: ['./api/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
       res.header('Access-Control-Allow-Methods',
       'PUT, POST, PATCH, DELETE, GET'
       ) ;
       return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports =  app;
