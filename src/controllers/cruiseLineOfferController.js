const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

class CruiseLineOfferController {
  static async createCruiseLineOffer(req, res) {
    try {
      const {
        cruise_id,
        title,
        tag,
        subtitle,
        description,
        cruiseLine,
        image
      } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'title is required' });
      }

      const now = new Date();
      const offer = {
        cruise_id: cruise_id || null,
        title,
        tag: tag || null,
        subtitle: subtitle || null,
        description: description || null,
        cruiseLine: cruiseLine || null,
        image: image || null,
        createdAt: now,
        updatedAt: now
      };

      const db = getDB();
      const result = await db.collection('cruise_line_offers').insertOne(offer);
      offer._id = result.insertedId;
      return res.status(201).json({ success: true, data: offer });
    } catch (error) {
      console.error('Error creating cruise line offer:', error);
      return res.status(500).json({ success: false, error: 'Failed to create cruise line offer' });
    }
  }

  static async getCruiseLineOffers(req, res) {
    try {
      const { page = 1, limit = 10, cruiseLine, q } = req.query;
      const db = getDB();
      const filter = {};
      
      if (cruiseLine) {
        filter.cruiseLine = { $regex: cruiseLine, $options: 'i' };
      }
      
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { subtitle: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tag: { $regex: q, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const collection = db.collection('cruise_line_offers');
      const totalCount = await collection.countDocuments(filter);
      const items = await collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      return res.json({
        success: true,
        data: items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)) || 1,
          totalCount,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching cruise line offers:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch cruise line offers' });
    }
  }

  static async getCruiseLineOfferById(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const db = getDB();
      const offer = await db.collection('cruise_line_offers').findOne({ _id: new ObjectId(id) });
      if (!offer) return res.status(404).json({ success: false, error: 'Cruise line offer not found' });
      return res.json({ success: true, data: offer });
    } catch (error) {
      console.error('Error fetching cruise line offer by id:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch cruise line offer' });
    }
  }

  static async updateCruiseLineOffer(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      
      const {
        cruise_id,
        title,
        tag,
        subtitle,
        description,
        cruiseLine,
        image
      } = req.body;

      const db = getDB();
      const updates = { updatedAt: new Date() };
      
      if (cruise_id !== undefined) updates.cruise_id = cruise_id;
      if (title !== undefined) updates.title = title;
      if (tag !== undefined) updates.tag = tag;
      if (subtitle !== undefined) updates.subtitle = subtitle;
      if (description !== undefined) updates.description = description;
      if (cruiseLine !== undefined) updates.cruiseLine = cruiseLine;
      if (image !== undefined) updates.image = image;

      const updateResult = await db.collection('cruise_line_offers').updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Cruise line offer not found' });
      }

      const updatedDoc = await db.collection('cruise_line_offers').findOne({ _id: new ObjectId(id) });
      return res.json({ success: true, data: updatedDoc });
    } catch (error) {
      console.error('Error updating cruise line offer:', error);
      return res.status(500).json({ success: false, error: 'Failed to update cruise line offer' });
    }
  }

  static async deleteCruiseLineOffer(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const db = getDB();
      const result = await db.collection('cruise_line_offers').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'Cruise line offer not found' });
      return res.json({ success: true, message: 'Cruise line offer deleted' });
    } catch (error) {
      console.error('Error deleting cruise line offer:', error);
      return res.status(500).json({ success: false, error: 'Failed to delete cruise line offer' });
    }
  }
}

module.exports = CruiseLineOfferController;

