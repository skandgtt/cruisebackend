const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

class FolderController {
  static async createFolder(req, res) {
    try {
      const { name, color } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'name is required' });
      }

      const now = new Date();
      const folder = {
        name: name.trim(),
        color: color || "#eab308",
        createdAt: now,
        updatedAt: now
      };

      const db = getDB();
      const result = await db.collection('folders').insertOne(folder);
      folder._id = result.insertedId;
      return res.status(201).json({ success: true, data: folder });
    } catch (error) {
      console.error('Error creating folder:', error);
      return res.status(500).json({ success: false, error: 'Failed to create folder' });
    }
  }

  static async getFolders(req, res) {
    try {
      const { page = 1, limit = 50, q } = req.query;
      const db = getDB();
      const filter = {};
      if (q) {
        filter.name = { $regex: q, $options: 'i' };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const collection = db.collection('folders');
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
      console.error('Error fetching folders:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch folders' });
    }
  }

  static async getFolderById(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const db = getDB();
      const folder = await db.collection('folders').findOne({ _id: new ObjectId(id) });
      if (!folder) return res.status(404).json({ success: false, error: 'Folder not found' });
      return res.json({ success: true, data: folder });
    } catch (error) {
      console.error('Error fetching folder by id:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch folder' });
    }
  }

  static async updateFolder(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const { name, color } = req.body;
      if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
        return res.status(400).json({ success: false, error: 'name must be a non-empty string' });
      }

      const db = getDB();
      const updates = { updatedAt: new Date() };
      if (name !== undefined) updates.name = name.trim();
      if (color !== undefined) updates.color = color;

      const updateResult = await db.collection('folders').updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Folder not found' });
      }

      const updatedDoc = await db.collection('folders').findOne({ _id: new ObjectId(id) });
      return res.json({ success: true, data: updatedDoc });
    } catch (error) {
      console.error('Error updating folder:', error);
      return res.status(500).json({ success: false, error: 'Failed to update folder' });
    }
  }

  static async deleteFolder(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const db = getDB();
      const result = await db.collection('folders').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'Folder not found' });
      return res.json({ success: true, message: 'Folder deleted' });
    } catch (error) {
      console.error('Error deleting folder:', error);
      return res.status(500).json({ success: false, error: 'Failed to delete folder' });
    }
  }
}

module.exports = FolderController;


