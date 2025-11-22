const { getDB } = require('../config/database');

class PaymentGatewayController {
  static async getStatus(req, res) {
    try {
      const db = getDB();
      const settings = await db.collection('payment_gateway_settings').findOne({});
      
      // If no settings exist, return default offline status
      const status = settings?.status || 'offline';
      
      return res.json({
        success: true,
        data: {
          status: status
        }
      });
    } catch (error) {
      console.error('Error fetching payment gateway status:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch payment gateway status' });
    }
  }

  static async setStatus(req, res) {
    try {
      const { status } = req.body;

      if (!status || (status !== 'online' && status !== 'offline')) {
        return res.status(400).json({ 
          success: false, 
          error: 'Status must be either "online" or "offline"' 
        });
      }

      const db = getDB();
      
      // Upsert the status (update if exists, insert if not)
      await db.collection('payment_gateway_settings').updateOne(
        {},
        { $set: { status: status, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.json({
        success: true,
        message: 'Payment gateway status updated',
        data: {
          status: status
        }
      });
    } catch (error) {
      console.error('Error setting payment gateway status:', error);
      return res.status(500).json({ success: false, error: 'Failed to set payment gateway status' });
    }
  }
}

module.exports = PaymentGatewayController;

