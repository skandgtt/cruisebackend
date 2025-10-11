const express = require('express');
const router = express.Router();
const CruiseController = require('../controllers/cruiseController');

router.get('/cruises', CruiseController.getCruises);
router.get('/operators', CruiseController.getOperators);
router.get('/ports', CruiseController.getPorts);
router.get('/destinations', CruiseController.getDestinations);
router.get('/itinerary', CruiseController.getItinerary);

// Package routes
router.get('/packages', CruiseController.getPackages);
router.get('/packages/:id', CruiseController.getPackageById);
router.post('/packages', CruiseController.createPackage);
router.put('/packages/:id', CruiseController.updatePackage);
router.delete('/packages/:id', CruiseController.deletePackage);

// Order routes
router.post('/orders', CruiseController.createOrder);
router.get('/orders', CruiseController.getOrders);
router.delete('/orders/:id', CruiseController.deleteOrder);

module.exports = router;