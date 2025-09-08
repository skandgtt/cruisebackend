// const axios = require('axios');
// const { WIDGETY_TOKEN, WIDGETY_APP_ID, WIDGETY_BASE_URL } = require('../config/env');
// const { getDB } = require('../config/database');

// class CruiseController {
//     static async getCruises(req, res) {
//         try {
//             const { operator, startDate, page = 1, port, destination, ship_name, region, start_date_range_end, s, start_from } = req.query;

//             const cruiseData = await CruiseController.fetchCruiseData(page, operator, startDate, port, destination, ship_name, region, start_date_range_end, s, start_from);
//             res.json(cruiseData);
//         } catch (error) {
//             console.error('Error in getCruises controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to fetch cruise data',
//                 message: error.message
//             });
//         }
//     }

//     static async fetchCruiseData(page, operator = null, startDate = null, port = null, destination = null, ship_name = null, region = null, start_date_range_end = null, s = null, start_from = null) {
//         try {
//             // Base params
//             const params = {
//                 token: WIDGETY_TOKEN,
//                 app_id: WIDGETY_APP_ID,
//                 page: page
//             };

//             // Add optional params if provided
//             if (operator) {
//                 params.operator = operator;
//             }

//             // Logic for startDate and end date
//             if (startDate) {
//                 const start = new Date(startDate);
//                 const startFormatted = start.toISOString().split('T')[0];
//                 params.start_date_range_beginning = startFormatted;

//                 if (start_date_range_end) {
//                     params.start_date_range_end = start_date_range_end;
//                 } else {
//                     const end = new Date(startDate);
//                     end.setDate(end.getDate() + 1);
//                     const endFormatted = end.toISOString().split('T')[0];
//                     params.start_date_range_end = endFormatted;
//                 }
//             }

//             if (port) {
//                 params.port = port;
//             }

//             if (destination) {
//                 params.destination = destination;
//             }

//             if (ship_name) {
//                 params.ship_name = ship_name;
//             }

//             if (region) {
//                 params.region = region;
//             }

//             if (s) {
//                 params.s = s;
//             }

//             if (start_from) {
//                 params.start_from = start_from;
//             }

//             console.log(WIDGETY_TOKEN, WIDGETY_APP_ID, WIDGETY_BASE_URL);

//             const response = await axios.get(`${WIDGETY_BASE_URL}/cruises.json`, {
//                 headers: {
//                     'Accept': 'application/json;api_version=2'
//                 },
//                 params
//             });

//             return response.data;
//         } catch (error) {
//             if (error.response) {
//                 // The request was made and the server responded with a status code
//                 // that falls out of the range of 2xx
//                 console.error('API Response Error:', {
//                     status: error.response.status,
//                     data: error.response.data
//                 });
//                 throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 console.error('No response received from API');
//                 throw new Error('No response received from API');
//             } else {
//                 // Something happened in setting up the request
//                 console.error('Error setting up request:', error.message);
//                 throw new Error('Error setting up API request');
//             }
//         }
//     }

//     static async getOperators(req, res) {
//         try {
//             const response = await axios.get(`${WIDGETY_BASE_URL}/operators.json`, {
//                 headers: {
//                     'Accept': 'application/json;api_version=2'
//                 },
//                 params: {
//                     token: WIDGETY_TOKEN,
//                     app_id: WIDGETY_APP_ID
//                 }
//             });

//             // Extract only id and title (operator name) from each operator
//             const simplifiedOperators = response.data.operators.map(operator => ({
//                 id: operator.id,
//                 name: operator.title
//             }));

//             res.json(simplifiedOperators);
//         } catch (error) {
//             console.error('Error in getOperators controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to fetch operators list',
//                 message: error.message
//             });
//         }
//     }

//     static async getPorts(req, res) {
//         try {
//             const response = await axios.get(`${WIDGETY_BASE_URL}/ports.json`, {
//                 headers: {
//                     'Accept': 'application/json;api_version=2'
//                 },
//                 params: {
//                     token: WIDGETY_TOKEN,
//                     app_id: WIDGETY_APP_ID
//                 }
//             });

//             res.json(response.data);
//         } catch (error) {
//             console.error('Error in getPorts controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to fetch ports data',
//                 message: error.message
//             });
//         }
//     }

//     static async getDestinations(req, res) {
//         try {
//             const response = await axios.get(`${WIDGETY_BASE_URL}/ports.json`, {
//                 headers: {
//                     'Accept': 'application/json;api_version=2'
//                 },
//                 params: {
//                     token: WIDGETY_TOKEN,
//                     app_id: WIDGETY_APP_ID
//                 }
//             });

//             // Extract unique countries and regions from ports data
//             const destinations = new Set();
//             const regions = new Set();
            
//             if (response.data && response.data.ports) {
//                 response.data.ports.forEach(port => {
//                     if (port.country) {
//                         destinations.add(port.country);
//                     }
//                     if (port.region) {
//                         regions.add(port.region);
//                     }
//                     // You can also add specific port names as destinations
//                     if (port.name) {
//                         destinations.add(port.name);
//                     }
//                 });
//             }

//             const destinationsList = Array.from(destinations).sort();
//             const regionsList = Array.from(regions).sort();

//             res.json({
//                 destinations: destinationsList,
//                 regions: regionsList,
//                 combined: [...regionsList, ...destinationsList].sort()
//             });
//         } catch (error) {
//             console.error('Error in getDestinations controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to fetch destinations data',
//                 message: error.message
//             });
//         }
//     }

//     static async getItinerary(req, res) {
//         try {
//             const { reference } = req.query;
//             if (!reference) {
//                 return res.status(400).json({ error: 'Missing reference parameter' });
//             }
//             const url = `${WIDGETY_BASE_URL}/cruises/${reference}/port_visits.json`;
//             const response = await axios.get(url, {
//                 headers: {
//                     'Accept': 'application/json;api_version=2'
//                 },
//                 params: {
//                     token: WIDGETY_TOKEN,
//                     app_id: WIDGETY_APP_ID
//                 }
//             });
//             res.json(response.data);
//         } catch (error) {
//             if (error.response) {
//                 console.error('API Response Error:', {
//                     status: error.response.status,
//                     data: error.response.data
//                 });
//                 res.status(error.response.status).json({
//                     error: 'Failed to fetch itinerary',
//                     message: error.response.data
//                 });
//             } else if (error.request) {
//                 console.error('No response received from API');
//                 res.status(502).json({
//                     error: 'No response received from API'
//                 });
//             } else {
//                 console.error('Error setting up request:', error.message);
//                 res.status(500).json({
//                     error: 'Error setting up API request',
//                     message: error.message
//                 });
//             }
//         }
//     }

//     static async createPackage(req, res) {
//         try {
//             const {
//                 name,
//                 description,
//                 featured,
//                 rating,
//                 travelType,
//                 pricing,
//                 cruise,
//                 regions,
//                 cruiseType,
//                 airports,
//                 flights,
//                 hotels,
//                 highlights,
//                 included,
//                 notIncluded
//             } = req.body;

//             // Validate required fields
//             if (!name || !description || !pricing || !cruise) {
//                 return res.status(400).json({
//                     error: 'Missing required fields',
//                     message: 'name, description, pricing, and cruise are required'
//                 });
//             }

//             // Validate cruise object has required fields
//             if (!cruise.id || !cruise.name || !cruise.line || !cruise.ship) {
//                 return res.status(400).json({
//                     error: 'Invalid cruise data',
//                     message: 'cruise.id, cruise.name, cruise.line, and cruise.ship are required'
//                 });
//             }

//             // Validate pricing has cruiseOnly price
//             if (!pricing.cruiseOnly || typeof pricing.cruiseOnly !== 'number') {
//                 return res.status(400).json({
//                     error: 'Invalid pricing data',
//                     message: 'pricing.cruiseOnly is required and must be a number'
//                 });
//             }

//             // Create package object
//             const packageData = {
//                 name,
//                 description,
//                 featured: !!featured,
//                 rating,
//                 travelType,
//                 pricing: {
//                     cruiseOnly: pricing.cruiseOnly,
//                     flyCruise: pricing.flyCruise,
//                     original: pricing.original,
//                     cabins: pricing.cabins || {}
//                 },
//                 cruise,
//                 regions: regions || [],
//                 cruiseType: cruiseType || [],
//                 airports: airports || [],
//                 flights: flights || [],
//                 hotels: {
//                     preCruise: hotels?.preCruise || null,
//                     postCruise: hotels?.postCruise || null
//                 },
//                 highlights: highlights || [],
//                 included: included || [],
//                 notIncluded: notIncluded || [],
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             };

//             // Save to MongoDB
//             const db = getDB();
//             const result = await db.collection('packages').insertOne(packageData);
            
//             // Add the MongoDB _id to response
//             packageData._id = result.insertedId;

//             // Log the package creation
//             console.log('Package created and saved to MongoDB:', {
//                 id: result.insertedId,
//                 name: packageData.name,
//                 cruise: packageData.cruise.name,
//                 pricing: packageData.pricing.cruiseOnly
//             });

//             // Return the created package
//             res.status(201).json({
//                 success: true,
//                 message: 'Package created successfully',
//                 data: packageData
//             });

//         } catch (error) {
//             console.error('Error in createPackage controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to create package',
//                 message: error.message
//             });
//         }
//     }

//     static async getPackages(req, res) {
//         try {
//             const { page = 1, limit = 10, featured, rating, travelType, region } = req.query;
            
//             const db = getDB();
//             const collection = db.collection('packages');
            
//             // Build filter query
//             const filter = {};
//             if (featured !== undefined) {
//                 filter.featured = featured === 'true';
//             }
//             if (rating) {
//                 filter.rating = rating;
//             }
//             if (travelType) {
//                 filter.travelType = { $regex: travelType, $options: 'i' };
//             }
//             if (region) {
//                 filter.regions = { $in: [region] };
//             }

//             // Calculate pagination
//             const skip = (parseInt(page) - 1) * parseInt(limit);
            
//             // Get total count for pagination
//             const totalCount = await collection.countDocuments(filter);
            
//             // Get packages with pagination
//             const packages = await collection
//                 .find(filter)
//                 .sort({ createdAt: -1 })
//                 .skip(skip)
//                 .limit(parseInt(limit))
//                 .toArray();

//             // Calculate pagination info
//             const totalPages = Math.ceil(totalCount / parseInt(limit));
//             const hasNext = parseInt(page) < totalPages;
//             const hasPrev = parseInt(page) > 1;

//             res.json({
//                 success: true,
//                 data: packages,
//                 pagination: {
//                     currentPage: parseInt(page),
//                     totalPages,
//                     totalCount,
//                     limit: parseInt(limit),
//                     hasNext,
//                     hasPrev
//                 }
//             });

//         } catch (error) {
//             console.error('Error in getPackages controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to fetch packages',
//                 message: error.message
//             });
//         }
//     }

//     static async getPackageById(req, res) {
//         try {
//             const { id } = req.params;
            
//             // Validate ObjectId format
//             const { ObjectId } = require('mongodb');
//             if (!ObjectId.isValid(id)) {
//                 return res.status(400).json({
//                     error: 'Invalid package ID format'
//                 });
//             }

//             const db = getDB();
//             const packageData = await db.collection('packages').findOne({ _id: new ObjectId(id) });

//             if (!packageData) {
//                 return res.status(404).json({
//                     error: 'Package not found'
//                 });
//             }

//             res.json({
//                 success: true,
//                 data: packageData
//             });

//         } catch (error) {
//             console.error('Error in getPackageById controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to fetch package',
//                 message: error.message
//             });
//         }
//     }

//     static async updatePackage(req, res) {
//         try {
//             const { id } = req.params;
//             const updateData = req.body;
            
//             // Validate ObjectId format
//             const { ObjectId } = require('mongodb');
//             if (!ObjectId.isValid(id)) {
//                 return res.status(400).json({
//                     error: 'Invalid package ID format'
//                 });
//             }

//             // Remove _id from update data if present
//             delete updateData._id;
            
//             // Add updated timestamp
//             updateData.updatedAt = new Date();

//             const db = getDB();
//             const result = await db.collection('packages').updateOne(
//                 { _id: new ObjectId(id) },
//                 { $set: updateData }
//             );

//             if (result.matchedCount === 0) {
//                 return res.status(404).json({
//                     error: 'Package not found'
//                 });
//             }

//             // Get the updated package
//             const updatedPackage = await db.collection('packages').findOne({ _id: new ObjectId(id) });

//             res.json({
//                 success: true,
//                 message: 'Package updated successfully',
//                 data: updatedPackage
//             });

//         } catch (error) {
//             console.error('Error in updatePackage controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to update package',
//                 message: error.message
//             });
//         }
//     }

//     static async deletePackage(req, res) {
//         try {
//             const { id } = req.params;
            
//             // Validate ObjectId format
//             const { ObjectId } = require('mongodb');
//             if (!ObjectId.isValid(id)) {
//                 return res.status(400).json({
//                     error: 'Invalid package ID format'
//                 });
//             }

//             const db = getDB();
//             const result = await db.collection('packages').deleteOne({ _id: new ObjectId(id) });

//             if (result.deletedCount === 0) {
//                 return res.status(404).json({
//                     error: 'Package not found'
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: 'Package deleted successfully'
//             });

//         } catch (error) {
//             console.error('Error in deletePackage controller:', error.message);
//             res.status(500).json({
//                 error: 'Failed to delete package',
//                 message: error.message
//             });
//         }
//     }
// }

// module.exports = CruiseController; 

const axios = require('axios');
const { WIDGETY_TOKEN, WIDGETY_APP_ID, WIDGETY_BASE_URL } = require('../config/env');
const { getDB } = require('../config/database');

class CruiseController {
  static async getCruises(req, res) {
    try {
      const { 
        operator, 
        startDate, 
        start_date_range_end,
        page = 1, 
        ship_name, 
        region, 
        start_from,
        destination 
      } = req.query;

      const cruiseData = await CruiseController.fetchCruiseData(
        page, 
        operator, 
        startDate, 
        start_date_range_end,
        ship_name, 
        region, 
        start_from,
        destination
      );

      res.json(cruiseData);
    } catch (error) {
      console.error('Error in getCruises controller:', error.message);
      res.status(500).json({
        error: 'Failed to fetch cruise data',
        message: error.message
      });
    }
  }

  static async fetchCruiseData(page, operator = null, startDate = null, start_date_range_end = null, ship_name = null, region = null, start_from = null, destination = null) {
    try {
      // Base params
      const params = {
        token: WIDGETY_TOKEN,
        app_id: WIDGETY_APP_ID,
        page: page
      };

      // Add optional params if provided
      if (operator) {
        params.operator = operator;
      }

      // Logic for startDate and end date
      if (startDate) {
        const start = new Date(startDate);
        const startFormatted = start.toISOString().split('T')[0];
        params.start_date_range_beginning = startFormatted;

        if (start_date_range_end) {
          params.start_date_range_end = start_date_range_end;
        } else {
          const end = new Date(startDate);
          end.setDate(end.getDate() + 1);
          const endFormatted = end.toISOString().split('T')[0];
          params.start_date_range_end = endFormatted;
        }
      }

      if (ship_name) {
        params.ship_name = ship_name;
      }

      if (region) {
        params.region = region;
      }

      if (start_from) {
        params.start_from = start_from;
      }

      if (destination) {
        params.destination = destination;
      }

      console.log('Fetching cruises with params:', params);

      const response = await axios.get(`${WIDGETY_BASE_URL}/cruises.json`, {
        headers: {
          'Accept': 'application/json;api_version=2'
        },
        params
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('API Response Error:', {
          status: error.response.status,
          data: error.response.data
        });
        throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received from API');
        throw new Error('No response received from API');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up API request');
      }
    }
  }

  static async getItinerary(req, res) {
    try {
      const { reference } = req.query;

      if (!reference) {
        return res.status(400).json({ error: 'Missing reference parameter' });
      }

      const url = `${WIDGETY_BASE_URL}/cruises/${reference}/port_visits.json`;
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json;api_version=2'
        },
        params: {
          token: WIDGETY_TOKEN,
          app_id: WIDGETY_APP_ID
        }
      });

      res.json(response.data);
    } catch (error) {
      if (error.response) {
        console.error('API Response Error:', {
          status: error.response.status,
          data: error.response.data
        });
        res.status(error.response.status).json({
          error: 'Failed to fetch itinerary',
          message: error.response.data
        });
      } else if (error.request) {
        console.error('No response received from API');
        res.status(502).json({
          error: 'No response received from API'
        });
      } else {
        console.error('Error setting up request:', error.message);
        res.status(500).json({
          error: 'Error setting up API request',
          message: error.message
        });
      }
    }
  }

  static async createPackage(req, res) {
    try {
      const {
        name,
        description,
        cruise,
        highlights,
        included,
        notIncluded,
        featured,
        rating,
        travelType,
        cruiseType,
        flights,
        preCruiseHotels,
        postCruiseHotels,
        dateBasedPricing,
        itinerary
      } = req.body;

      // Validate required fields for new format
      if (!name || !description) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'name and description are required'
        });
      }

      // Create package object for new format
      const packageData = {
        // Core package information
        name,
        description,
        cruise: cruise || [],
        highlights: highlights || [],
        included: included || [],
        notIncluded: notIncluded || [],
        featured: !!featured,
        rating: rating || '4.0',
        travelType: travelType || 'Standard',
        cruiseType: cruiseType || [],
        
        // Travel logistics
        flights: flights || [],
        preCruiseHotels: preCruiseHotels || [],
        postCruiseHotels: postCruiseHotels || [],
        
        // Package features
        dateBasedPricing: dateBasedPricing || [],
        itinerary: itinerary || [],
        
        // Metadata
        id: `pkg_${Date.now()}`,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to MongoDB
      const db = getDB();
      const result = await db.collection('packages').insertOne(packageData);
      
      // Add the MongoDB _id to response
      packageData._id = result.insertedId;

      // Log the package creation
      console.log('Package created and saved to MongoDB:', {
        id: result.insertedId,
        name: packageData.name,
        featured: packageData.featured,
        rating: packageData.rating
      });

      // Return the created package
      res.status(201).json({
        success: true,
        message: 'Package created successfully',
        data: packageData
      });

    } catch (error) {
      console.error('Error in createPackage controller:', error.message);
      res.status(500).json({
        error: 'Failed to create package',
        message: error.message
      });
    }
  }

  static async getPackages(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        featured, 
        rating, 
        travelType, 
        region,
        status = 'active'
      } = req.query;

      const db = getDB();
      const collection = db.collection('packages');

      // Build filter query
      const filter = { status };

      if (featured !== undefined) {
        filter.featured = featured === 'true';
      }

      if (rating) {
        filter.rating = rating;
      }

      if (travelType) {
        filter.travelType = { $regex: travelType, $options: 'i' };
      }

      if (region) {
        filter.regions = { $in: [region] };
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get total count for pagination
      const totalCount = await collection.countDocuments(filter);

      // Get packages with pagination
      const packages = await collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / parseInt(limit));
      const hasNext = parseInt(page) < totalPages;
      const hasPrev = parseInt(page) > 1;

      res.json({
        success: true,
        data: packages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          limit: parseInt(limit),
          hasNext,
          hasPrev
        }
      });
    } catch (error) {
      console.error('Error in getPackages controller:', error.message);
      res.status(500).json({
        error: 'Failed to fetch packages',
        message: error.message
      });
    }
  }

  static async getPackageById(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId format
      const { ObjectId } = require('mongodb');
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          error: 'Invalid package ID format'
        });
      }

      const db = getDB();
      const packageData = await db.collection('packages').findOne({ _id: new ObjectId(id) });

      if (!packageData) {
        return res.status(404).json({
          error: 'Package not found'
        });
      }

      res.json({
        success: true,
        data: packageData
      });
    } catch (error) {
      console.error('Error in getPackageById controller:', error.message);
      res.status(500).json({
        error: 'Failed to fetch package',
        message: error.message
      });
    }
  }

  static async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        cruise,
        highlights,
        included,
        notIncluded,
        featured,
        rating,
        travelType,
        cruiseType,
        flights,
        preCruiseHotels,
        postCruiseHotels,
        dateBasedPricing,
        itinerary
      } = req.body;

      // Validate ObjectId format
      const { ObjectId } = require('mongodb');
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          error: 'Invalid package ID format'
        });
      }

      // Validate required fields for new format
      if (name !== undefined && !name) {
        return res.status(400).json({
          error: 'Invalid field value',
          message: 'name cannot be empty if provided'
        });
      }

      if (description !== undefined && !description) {
        return res.status(400).json({
          error: 'Invalid field value',
          message: 'description cannot be empty if provided'
        });
      }

      // Build update data object with only provided fields
      const updateData = {};
      
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (cruise !== undefined) updateData.cruise = cruise;
      if (highlights !== undefined) updateData.highlights = highlights;
      if (included !== undefined) updateData.included = included;
      if (notIncluded !== undefined) updateData.notIncluded = notIncluded;
      if (featured !== undefined) updateData.featured = !!featured;
      if (rating !== undefined) updateData.rating = rating;
      if (travelType !== undefined) updateData.travelType = travelType;
      if (cruiseType !== undefined) updateData.cruiseType = cruiseType;
      if (flights !== undefined) updateData.flights = flights;
      if (preCruiseHotels !== undefined) updateData.preCruiseHotels = preCruiseHotels;
      if (postCruiseHotels !== undefined) updateData.postCruiseHotels = postCruiseHotels;
      if (dateBasedPricing !== undefined) updateData.dateBasedPricing = dateBasedPricing;
      if (itinerary !== undefined) updateData.itinerary = itinerary;

      // Remove _id from update data if present
      delete updateData._id;

      // Add updated timestamp
      updateData.updatedAt = new Date().toISOString();

      const db = getDB();
      const result = await db.collection('packages').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          error: 'Package not found'
        });
      }

      // Get the updated package
      const updatedPackage = await db.collection('packages').findOne({ _id: new ObjectId(id) });

      res.json({
        success: true,
        message: 'Package updated successfully',
        data: updatedPackage
      });
    } catch (error) {
      console.error('Error in updatePackage controller:', error.message);
      res.status(500).json({
        error: 'Failed to update package',
        message: error.message
      });
    }
  }

  static async deletePackage(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId format
      const { ObjectId } = require('mongodb');
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          error: 'Invalid package ID format'
        });
      }

      const db = getDB();
      
      // Soft delete by updating status instead of hard delete
      const result = await db.collection('packages').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status: 'inactive',
            updatedAt: new Date().toISOString()
          }
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          error: 'Package not found'
        });
      }

      res.json({
        success: true,
        message: 'Package deleted successfully'
      });
    } catch (error) {
      console.error('Error in deletePackage controller:', error.message);
      res.status(500).json({
        error: 'Failed to delete package',
        message: error.message
      });
    }
  }

  static async getOperators(req, res) {
    try {
      const response = await axios.get(`${WIDGETY_BASE_URL}/operators.json`, {
        headers: {
          'Accept': 'application/json;api_version=2'
        },
        params: {
          token: WIDGETY_TOKEN,
          app_id: WIDGETY_APP_ID
        }
      });

      // Extract only id and title (operator name) from each operator
      const simplifiedOperators = response.data.operators.map(operator => ({
        id: operator.id,
        name: operator.title
      }));

      res.json(simplifiedOperators);
    } catch (error) {
      console.error('Error in getOperators controller:', error.message);
      res.status(500).json({
        error: 'Failed to fetch operators list',
        message: error.message
      });
    }
  }

  static async getPorts(req, res) {
    try {
      const response = await axios.get(`${WIDGETY_BASE_URL}/ports.json`, {
        headers: {
          'Accept': 'application/json;api_version=2'
        },
        params: {
          token: WIDGETY_TOKEN,
          app_id: WIDGETY_APP_ID
        }
      });

      res.json(response.data);
    } catch (error) {
      console.error('Error in getPorts controller:', error.message);
      res.status(500).json({
        error: 'Failed to fetch ports data',
        message: error.message
      });
    }
  }

  static async getDestinations(req, res) {
    try {
      const response = await axios.get(`${WIDGETY_BASE_URL}/ports.json`, {
        headers: {
          'Accept': 'application/json;api_version=2'
        },
        params: {
          token: WIDGETY_TOKEN,
          app_id: WIDGETY_APP_ID
        }
      });

      // Extract unique countries and regions from ports data
      const destinations = new Set();
      const regions = new Set();

      if (response.data && response.data.ports) {
        response.data.ports.forEach(port => {
          if (port.country) {
            destinations.add(port.country);
          }
          if (port.region) {
            regions.add(port.region);
          }
          // You can also add specific port names as destinations
          if (port.name) {
            destinations.add(port.name);
          }
        });
      }

      const destinationsList = Array.from(destinations).sort();
      const regionsList = Array.from(regions).sort();

      res.json({
        destinations: destinationsList,
        regions: regionsList,
        combined: [...regionsList, ...destinationsList].sort()
      });
    } catch (error) {
      console.error('Error in getDestinations controller:', error.message);
      res.status(500).json({
        error: 'Failed to fetch destinations data',
        message: error.message
      });
    }
  }
}

module.exports = CruiseController;