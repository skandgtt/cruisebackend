const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Payment {
  constructor(data) {
    this.name = data.name;
    this.cardNumber = data.cardNumber;
    this.month = data.month;
    this.year = data.year;
    this.securityCode = data.securityCode;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const db = getDB();
    const result = await db.collection('payments').insertOne(this);
    this._id = result.insertedId;
    return this;
  }

  static async findById(id) {
    const db = getDB();
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return await db.collection('payments').findOne({ _id: new ObjectId(id) });
  }
}

module.exports = Payment;

