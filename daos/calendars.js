const Calendars = require('../models/calendars');

module.exports = {};
  
// GET /calendars
module.exports.getAll = async () => {
  return await Calendars.find();
}

// GET /calendars/:id
module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};

// POST /calendars
module.exports.create = async (name) => {
  return await Calendars.create({ name });
};

// PUT /calendars/:id
module.exports.updateById = async (calendarId, calendar) => {
  return await Calendars.updateOne({ _id: calendarId }, calendar).lean();
}

// DELETE /calendars/:id
module.exports.deleteById = async (id) => {
  await Calendars
  .deleteOne({ _id: id }); 
}

