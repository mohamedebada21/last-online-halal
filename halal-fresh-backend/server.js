// server.js
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config(); // Loads variables from .env file

const app = express();
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows the server to read JSON data

// Set your secret API key from the .env file
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// API endpoint for new order notifications
app.post('/api/new-order', (req, res) => {
  const { orderDetails } = req.body;

  const adminEmail = {
    to: 'halalonlinestore101@gmail.com',
    from: 'YOUR_VERIFIED_SENDER_EMAIL@domain.com', // Replace with your verified SendGrid email
    subject: `New Order Received: #${orderDetails.orderId}`,
    html: `<h1>New Order!</h1><p>You have a new order from ${orderDetails.customerDetails.name}.</p>
           <p>Total: $${orderDetails.totalAmount.toFixed(2)}</p>
           <p>View the order in your admin dashboard.</p>`,
  };

  sgMail.send(adminEmail)
    .then(() => res.status(200).send({ message: 'Admin notified.' }))
    .catch(error => {
        console.error(error.response.body);
        res.status(500).send({ error: 'Failed to send email' });
    });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));