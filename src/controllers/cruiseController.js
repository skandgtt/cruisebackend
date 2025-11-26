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
        page = '1', 
        ship_name, 
        region, 
        start_from,
        destination 
      } = req.query;

      // Special mode: page=all → fetch all pages in parallel and merge
      if (page === 'all') {
        // 1) Fetch first page to discover total pages
        const firstPage = await CruiseController.fetchCruiseData(
          1,
          operator,
          startDate,
          start_date_range_end,
          ship_name,
          region,
          start_from,
          destination
        );

        const total = firstPage?.total;
        const perPage = firstPage?.count || (Array.isArray(firstPage?.cruises) ? firstPage.cruises.length : 0);

        // If we can't determine pagination, just return the first page
        if (!total || !perPage || perPage === 0) {
          return res.json(firstPage);
        }

        const totalPages = Math.ceil(total / perPage);

        // If only one page, return it as-is
        if (totalPages <= 1) {
          return res.json(firstPage);
        }

        // 2) Fetch remaining pages in parallel
        const pageNumbers = [];
        for (let p = 2; p <= totalPages; p++) {
          pageNumbers.push(p);
        }

        const otherPages = await Promise.all(
          pageNumbers.map((p) =>
            CruiseController.fetchCruiseData(
              p,
              operator,
              startDate,
              start_date_range_end,
              ship_name,
              region,
              start_from,
              destination
            )
          )
        );

        // 3) Merge all cruises into a single array
        const allCruises = [
          ...(firstPage.cruises || []),
          ...otherPages.flatMap((pg) => pg?.cruises || [])
        ];

        const merged = {
          ...firstPage,
          cruises: allCruises,
          count: allCruises.length,
          // Optional: neutralize pagination links since we've returned everything
          _links: {
            ...(firstPage._links || {}),
            next: null,
            last: null
          }
        };

        return res.json(merged);
      }

      // Default: single-page behavior (unchanged)
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
        regions,
        airports,
        officialLink,
        featuredImage,
        pricing,
        dateBasedPricing,
        flights,
        preCruiseHotels,
        postCruiseHotels,
        itinerary
      } = req.body;

      // Validate required fields for new format
      if (!name || !description) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'name and description are required'
        });
      }
      if (featuredImage !== undefined && typeof featuredImage !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid featuredImage', details: { featuredImage: 'must be a string' } });
      }

      // Helpers
      const isValidISODate = (value) => {
        if (typeof value !== 'string') return false;
        const date = new Date(value);
        return !isNaN(date.getTime()) && value.length >= 10;
      };
      const isValidTime = (value) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value || '');

      // Field validations per rules
      if (typeof name !== 'string' || name.length < 3 || name.length > 200) {
        return res.status(400).json({ success: false, error: 'Invalid name', details: { name: '3-200 chars' } });
      }
      if (typeof description !== 'string' || description.length < 10 || description.length > 2000) {
        return res.status(400).json({ success: false, error: 'Invalid description', details: { description: '10-2000 chars' } });
      }

      if (pricing) {
        const keys = ['price','originalPrice','flyCruisePrice','insidePrice','outsidePrice','balconyPrice','suitePrice'];
        for (const k of keys) {
          if (pricing[k] !== undefined && (typeof pricing[k] !== 'number' || pricing[k] < 0)) {
            return res.status(400).json({ success: false, error: 'Invalid pricing', details: { [k]: 'must be number >= 0' } });
          }
        }
      }

      if (Array.isArray(dateBasedPricing)) {
        for (const item of dateBasedPricing) {
          if (item.travelDate !== undefined && !isValidISODate(item.travelDate)) {
            return res.status(400).json({ success: false, error: 'Invalid dateBasedPricing.travelDate' });
          }
          for (const k of ['inside','outside','suite']) {
            if (item[k] !== undefined && (typeof item[k] !== 'number' || item[k] < 0)) {
              return res.status(400).json({ success: false, error: `Invalid dateBasedPricing.${k}` });
            }
          }
        }
      }

      if (Array.isArray(flights)) {
        for (const f of flights) {
          if (f.price !== undefined && (typeof f.price !== 'number' || f.price < 0)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.price' });
          }
          if (f.flightClass !== undefined && !['Economy','Premium Economy','Business','First'].includes(f.flightClass)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.flightClass' });
          }
          if (f.outbound?.date && !isValidISODate(f.outbound.date)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.outbound.date' });
          }
          if (f.inbound?.date && !isValidISODate(f.inbound.date)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.inbound.date' });
          }
          const segments = [f?.outbound?.departure, f?.outbound?.arrival, f?.inbound?.departure, f?.inbound?.arrival];
          for (const seg of segments) {
            if (!seg) continue;
            if (seg.time && !isValidTime(seg.time)) {
              return res.status(400).json({ success: false, error: 'Invalid flights time format HH:MM' });
            }
          }
        }
      }

      const validateHotel = (h) => {
        if (h.rating !== undefined && (typeof h.rating !== 'number' || h.rating < 1 || h.rating > 5)) return 'rating 1-5';
        if (h.price !== undefined && (typeof h.price !== 'number' || h.price < 0)) return 'price >= 0';
        if (h.nights !== undefined && (typeof h.nights !== 'number' || h.nights < 1)) return 'nights >= 1';
        if (h.checkInDate && !isValidISODate(h.checkInDate)) return 'checkInDate ISO';
        if (h.checkOutDate && !isValidISODate(h.checkOutDate)) return 'checkOutDate ISO';
        return null;
      };
      if (Array.isArray(preCruiseHotels)) {
        for (const h of preCruiseHotels) {
          const err = validateHotel(h);
          if (err) return res.status(400).json({ success: false, error: `Invalid preCruiseHotels: ${err}` });
        }
      }
      if (Array.isArray(postCruiseHotels)) {
        for (const h of postCruiseHotels) {
          const err = validateHotel(h);
          if (err) return res.status(400).json({ success: false, error: `Invalid postCruiseHotels: ${err}` });
        }
      }

      if (Array.isArray(itinerary)) {
        for (const d of itinerary) {
          if (d.dayNumber !== undefined && (typeof d.dayNumber !== 'number' || d.dayNumber < 1)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.dayNumber' });
          }
          if (d.date && !isValidISODate(d.date)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.date' });
          }
          if (d.startTime && !isValidTime(d.startTime)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.startTime' });
          }
          if (d.endTime && !isValidTime(d.endTime)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.endTime' });
          }
        }
      }

      // Create package object for new format
      const packageData = {
        // Core package information
        name,
        description,
        cruise: cruise || {},
        highlights: highlights || [],
        included: included || [],
        notIncluded: notIncluded || [],
        featured: !!featured,
        rating: rating || undefined,
        travelType: travelType || undefined,
        cruiseType: cruiseType || [],
        regions: regions || [],
        airports: airports || [],
        officialLink: officialLink || undefined,
        featuredImage: featuredImage || undefined,
        
        // Travel logistics
        flights: flights || [],
        preCruiseHotels: preCruiseHotels || [],
        postCruiseHotels: postCruiseHotels || [],
        
        // Package features
        pricing: pricing || {},
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
      const updateBody = req.body;

      // Validate ObjectId format
      const { ObjectId } = require('mongodb');
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          error: 'Invalid package ID format'
        });
      }

      // Basic validations when fields provided
      const isValidISODate = (value) => {
        if (typeof value !== 'string') return false;
        const date = new Date(value);
        return !isNaN(date.getTime()) && value.length >= 10;
      };
      const isValidTime = (value) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value || '');
      if (updateBody.name !== undefined) {
        if (typeof updateBody.name !== 'string' || updateBody.name.length < 3 || updateBody.name.length > 200) {
          return res.status(400).json({ success: false, error: 'Invalid name' });
        }
      }
      if (updateBody.description !== undefined) {
        if (typeof updateBody.description !== 'string' || updateBody.description.length < 10 || updateBody.description.length > 2000) {
          return res.status(400).json({ success: false, error: 'Invalid description' });
        }
      }
      if (updateBody.featuredImage !== undefined && typeof updateBody.featuredImage !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid featuredImage' });
      }
      if (updateBody.pricing) {
        const p = updateBody.pricing;
        const keys = ['price','originalPrice','flyCruisePrice','insidePrice','outsidePrice','balconyPrice','suitePrice'];
        for (const k of keys) {
          if (p[k] !== undefined && (typeof p[k] !== 'number' || p[k] < 0)) {
            return res.status(400).json({ success: false, error: 'Invalid pricing' });
          }
        }
      }
      if (Array.isArray(updateBody.dateBasedPricing)) {
        for (const item of updateBody.dateBasedPricing) {
          if (item.travelDate !== undefined && !isValidISODate(item.travelDate)) {
            return res.status(400).json({ success: false, error: 'Invalid dateBasedPricing.travelDate' });
          }
          for (const k of ['inside','outside','suite']) {
            if (item[k] !== undefined && (typeof item[k] !== 'number' || item[k] < 0)) {
              return res.status(400).json({ success: false, error: `Invalid dateBasedPricing.${k}` });
            }
          }
        }
      }
      if (Array.isArray(updateBody.flights)) {
        for (const f of updateBody.flights) {
          if (f.price !== undefined && (typeof f.price !== 'number' || f.price < 0)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.price' });
          }
          if (f.flightClass !== undefined && !['Economy','Premium Economy','Business','First'].includes(f.flightClass)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.flightClass' });
          }
          if (f.outbound?.date && !isValidISODate(f.outbound.date)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.outbound.date' });
          }
          if (f.inbound?.date && !isValidISODate(f.inbound.date)) {
            return res.status(400).json({ success: false, error: 'Invalid flights.inbound.date' });
          }
          const segments = [f?.outbound?.departure, f?.outbound?.arrival, f?.inbound?.departure, f?.inbound?.arrival];
          for (const seg of segments) {
            if (!seg) continue;
            if (seg.time && !isValidTime(seg.time)) {
              return res.status(400).json({ success: false, error: 'Invalid flights time format HH:MM' });
            }
          }
        }
      }
      const validateHotel = (h) => {
        if (h.rating !== undefined && (typeof h.rating !== 'number' || h.rating < 1 || h.rating > 5)) return 'rating 1-5';
        if (h.price !== undefined && (typeof h.price !== 'number' || h.price < 0)) return 'price >= 0';
        if (h.nights !== undefined && (typeof h.nights !== 'number' || h.nights < 1)) return 'nights >= 1';
        if (h.checkInDate && !isValidISODate(h.checkInDate)) return 'checkInDate ISO';
        if (h.checkOutDate && !isValidISODate(h.checkOutDate)) return 'checkOutDate ISO';
        return null;
      };
      if (Array.isArray(updateBody.preCruiseHotels)) {
        for (const h of updateBody.preCruiseHotels) {
          const err = validateHotel(h);
          if (err) return res.status(400).json({ success: false, error: `Invalid preCruiseHotels: ${err}` });
        }
      }
      if (Array.isArray(updateBody.postCruiseHotels)) {
        for (const h of updateBody.postCruiseHotels) {
          const err = validateHotel(h);
          if (err) return res.status(400).json({ success: false, error: `Invalid postCruiseHotels: ${err}` });
        }
      }
      if (Array.isArray(updateBody.itinerary)) {
        for (const d of updateBody.itinerary) {
          if (d.dayNumber !== undefined && (typeof d.dayNumber !== 'number' || d.dayNumber < 1)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.dayNumber' });
          }
          if (d.date && !isValidISODate(d.date)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.date' });
          }
          if (d.startTime && !isValidTime(d.startTime)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.startTime' });
          }
          if (d.endTime && !isValidTime(d.endTime)) {
            return res.status(400).json({ success: false, error: 'Invalid itinerary.endTime' });
          }
        }
      }

      // Build update data object with only provided fields
      const updateData = {};
      
      const allowed = ['name','description','cruise','highlights','included','notIncluded','featured','rating','travelType','cruiseType','regions','airports','officialLink','featuredImage','pricing','dateBasedPricing','flights','preCruiseHotels','postCruiseHotels','itinerary'];
      for (const k of allowed) {
        if (updateBody[k] !== undefined) {
          if (k === 'featured') updateData[k] = !!updateBody[k];
          else updateData[k] = updateBody[k];
        }
      }

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

  static async createOrder(req, res) {
    try {
      const {
        orderId,
        bookingReference,
        orderStatus,
        cardNumber,
        nameOnCard,
        cvv,
        expiryDate,
        ...restData
      } = req.body;

      // Validate required fields
      if (!orderId || !bookingReference || !orderStatus) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'orderId, bookingReference, and orderStatus are required'
        });
      }

      // Build order data with card details (optional)
      const orderData = {
        orderId,
        bookingReference,
        orderStatus,
        ...restData,
        // Card details (optional)
        ...(cardNumber !== undefined && { cardNumber }),
        ...(nameOnCard !== undefined && { nameOnCard }),
        ...(cvv !== undefined && { cvv }),
        ...(expiryDate !== undefined && { expiryDate })
      };

      // Add timestamps
      orderData.createdAt = new Date();
      orderData.updatedAt = new Date();

      // Save to MongoDB
      const db = getDB();
      const result = await db.collection('orders').insertOne(orderData);
      
      // Add the MongoDB _id to response
      orderData._id = result.insertedId;

      // Log the order creation
      console.log('Order created and saved to MongoDB:', {
        id: result.insertedId,
        orderId: orderData.orderId,
        bookingReference: orderData.bookingReference,
        orderStatus: orderData.orderStatus
      });

      // Return the created order
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: orderData
      });

    } catch (error) {
      console.error('Error in createOrder controller:', error.message);
      res.status(500).json({
        error: 'Failed to create order',
        message: error.message
      });
    }
  }

  static async getOrders(req, res) {
    try {
      const { orderId, page = 1, limit = 10 } = req.query;
      
      const db = getDB();
      const collection = db.collection('orders');
      
      // Build filter query
      const filter = {};
      if (orderId) {
        filter.orderId = orderId;
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get total count for pagination
      const totalCount = await collection.countDocuments(filter);
      
      // Get orders with pagination
      const orders = await collection
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
        data: orders,
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
      console.error('Error in getOrders controller:', error.message);
      res.status(500).json({
        error: 'Failed to fetch orders',
        message: error.message
      });
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ObjectId format
      const { ObjectId } = require('mongodb');
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          error: 'Invalid order ID format'
        });
      }

      const db = getDB();
      const result = await db.collection('orders').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Order deleted successfully'
      });

    } catch (error) {
      console.error('Error in deleteOrder controller:', error.message);
      res.status(500).json({
        error: 'Failed to delete order',
        message: error.message
      });
    }
  }
}

module.exports = CruiseController;