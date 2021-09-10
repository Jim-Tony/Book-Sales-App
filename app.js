const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { default: Stripe } = require('stripe');
const app = express();

// Handle Middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Index Page
app.get('/',(req,res)=>{
    res.render('index',{
      stripePublishableKey : keys.stripePublishableKey
    });
});
// Charge Route
app.post('/charge', (req, res) => {
    const amount = 100;
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
      amount,
      description: 'Book Ordered',
      currency: 'INR',
      customer: customer.id
    }))
    .then(charge => res.render('success'));
  });
  

app.use(express.static(`${__dirname}/public`));

const port  = process.env.PORT || 5000;
app.listen(port,()=> console.log(`Server is running in port ${port}`));