
// note_routes.js

var braintree      = require('braintree');


// BRAINTREE//////////////
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "pd9cv5x2xsqryd6g",
  publicKey: "yq44yn4rvrfjp5tb",
  privateKey: "493c55f5e155b8593334c187a636b89b"
});
//////////////////////////



module.exports = function(app, db) {

  // get client token
  app.get('/client_token', (req, res) => {
    console.log('We are getting client token')
    gateway.clientToken.generate({}, (err, result) => {
        res.send(result.clientToken);
    });
  });

  // make transaction
  app.post('/checkout', (req, res) => {
    var nonceFromTheClient = req.body.payment_method_nonce;
    // THEN MAKE a transaction
    console.log('into transaction')
    gateway.transaction.sale({
      amount: '10',
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    }, (err, result) => {
      if (err) {
        console.log("There was a error")
      } else { 
        console.log("Success checkout")
        res.send(result);
      }
    });
  });

 // card verification
  app.post('/card_verification', (req, res) => {

    var nonceFromTheClient = req.body.payment_method_nonce;

    gateway.paymentMethod.create({
      customerId: "theCustomerId",
      paymentMethodNonce: nonceFromTheClient,
      options: {
        verifyCard: true,
        verificationMerchantAccountId: "theMerchantAccountId",
        verificationAmount: "2.00",
      }
  }, (err, result) => {
    if (err) {
        console.log("There was a error")
      } else {
        res.send(result);
      }
    });
  });

  // result verification
  app.post('/resutl_verification', (req, res) => {

    var nonceFromTheClient = req.body.payment_method_nonce;

    gateway.paymentMethod.create({
      customerId: "276830736",
      paymentMethodNonce: nonceFromTheClient,
      options: {
        verifyCard: true,
      }
  }, (err, result) => {
    if (err) {
        res.log("There was a error")
      } else {
        res.send(result);
      }
    });
  });

  // create customer
  app.post('/createCustomer', (req, res) => {
    gateway.customer.create({
      firstName: "Jen",
      lastName: "Smith",
      company: "Braintree",
      email: "jen@example.com",
      phone: "312.555.1234",
      fax: "614.555.5678",
      website: "www.example.com"
  }, (err, result) => {
    if (err) {
        res.log("There was a error create customer")
      } else {
        res.send(result);
      }
    });
  });

};


