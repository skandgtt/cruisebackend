const express = require('express');
const PaymentGatewayController = require('../controllers/paymentGatewayController');

const router = express.Router();

router.get('/payment-gateway/status', PaymentGatewayController.getStatus);
router.post('/payment-gateway/status', PaymentGatewayController.setStatus);

module.exports = router;

