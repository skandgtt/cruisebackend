const express = require('express');



const { createPayment, getPaymentById, initiatePayment, handleCallback, getPaymentStatus } = require('../controllers/paymentController');

const rateLimit = require('express-rate-limit');

const router = express.Router();

const limiter = rateLimit({

    windowMs: 1 * 60 * 1000,

    max: 10

});

router.post('/payments', createPayment);

router.post('/pay', limiter, initiatePayment);

router.post('/payment/callback', handleCallback);

router.get('/payment/status/:paymentId', getPaymentStatus);

// router.get('/payments/:id', getPaymentById);

module.exports = router;
