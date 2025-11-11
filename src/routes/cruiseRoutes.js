const express = require('express');
const router = express.Router();
const CruiseController = require('../controllers/cruiseController');
const PageController = require('../controllers/pageController');
const FolderController = require('../controllers/folderController');

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

// Page routes
router.get('/pages', PageController.getPages);
router.get('/pages/:id', PageController.getPageById);
router.post('/pages', PageController.createPage);
router.put('/pages/:id', PageController.updatePage);
router.delete('/pages/:id', PageController.deletePage);

// Folder routes (name-only CRUD)
router.get('/folders', FolderController.getFolders);
router.get('/folders/:id', FolderController.getFolderById);
router.post('/folders', FolderController.createFolder);
router.put('/folders/:id', FolderController.updateFolder);
router.delete('/folders/:id', FolderController.deleteFolder);

// Order routes
router.post('/orders', CruiseController.createOrder);
router.get('/orders', CruiseController.getOrders);
router.delete('/orders/:id', CruiseController.deleteOrder);

module.exports = router;