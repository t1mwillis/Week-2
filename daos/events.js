const Events = require('../models/events');

module.exports = {};
  
// GET /calendars/:id/events
module.exports.getAll = async () => {
  return await Events.find();
}

// GET /calendar/:id/events/:eventId
module.exports.getById = async (eventId) => {
  try {
    const events = await Events.findOne({ _id: eventId }).lean();
    return events;
  } catch (e) {
    return null;
  }
};

// POST /calendars/:id/events
module.exports.create = async (name, date) => {
  return await Events.create({ name, date });
};

// PUT //calendars/:id/events/:eventId
module.exports.updateById = async (eventId, event) => {
  return await Events.updateOne({ _id: eventId }, event).lean();
}

// DELETE /calendars/:id/events/:eventId
module.exports.deleteById = async (eventId) => {
  await Events
  .deleteOne({ _id: eventId }); 
}

