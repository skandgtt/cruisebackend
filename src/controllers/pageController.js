const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

class PageController {
  static async createPage(req, res) {
    try {
      const {
        title,
        slug,
        description,
        status,
        cruiseRef,
        cruiseSnapshot,
        seo,
        visibility,
        filters,
        folder,
        folderId
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ success: false, error: 'title and slug are required' });
      }

      const now = new Date();
      const page = {
        title,
        slug,
        description: description || '',
        status: status || 'draft',
        cruiseRef: cruiseRef || null,
        cruiseSnapshot: cruiseSnapshot || null,
        seo: seo || {},
        visibility: visibility || { isFeatured: false },
        filters: filters || {},
        folder: folder || null,
        folderId: folderId || null,
        createdAt: now,
        updatedAt: now
      };

      const db = getDB();
      const existing = await db.collection('pages').findOne({ slug });
      if (existing) {
        return res.status(409).json({ success: false, error: 'Slug already exists' });
      }

      const result = await db.collection('pages').insertOne(page);
      page._id = result.insertedId;
      return res.status(201).json({ success: true, data: page });
    } catch (error) {
      console.error('Error creating page:', error);
      return res.status(500).json({ success: false, error: 'Failed to create page' });
    }
  }

  static async getPages(req, res) {
    try {
      const { page = 1, limit = 10, status, featured, q } = req.query;
      const db = getDB();
      const filter = {};
      if (status) filter.status = status;
      if (featured !== undefined) filter['visibility.isFeatured'] = featured === 'true';
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { slug: { $regex: q, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const collection = db.collection('pages');
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
      console.error('Error fetching pages:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch pages' });
    }
  }

  static async getPageById(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const db = getDB();
      const page = await db.collection('pages').findOne({ _id: new ObjectId(id) });
      if (!page) return res.status(404).json({ success: false, error: 'Page not found' });
      return res.json({ success: true, data: page });
    } catch (error) {
      console.error('Error fetching page by id:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch page' });
    }
  }

  static async updatePage(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const updates = { ...req.body, updatedAt: new Date() };
      if (updates.slug === '') delete updates.slug;

      const db = getDB();
      if (updates.slug) {
        const exists = await db.collection('pages').findOne({ slug: updates.slug, _id: { $ne: new ObjectId(id) } });
        if (exists) {
          return res.status(409).json({ success: false, error: 'Slug already exists' });
        }
      }

      const updateResult = await db.collection('pages').updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Page not found' });
      }

      const updatedDoc = await db.collection('pages').findOne({ _id: new ObjectId(id) });
      return res.json({ success: true, data: updatedDoc });
    } catch (error) {
      console.error('Error updating page:', error);
      return res.status(500).json({ success: false, error: 'Failed to update page' });
    }
  }

  static async deletePage(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }
      const db = getDB();
      const result = await db.collection('pages').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ success: false, error: 'Page not found' });
      return res.json({ success: true, message: 'Page deleted' });
    } catch (error) {
      console.error('Error deleting page:', error);
      return res.status(500).json({ success: false, error: 'Failed to delete page' });
    }
  }
}

module.exports = PageController;


