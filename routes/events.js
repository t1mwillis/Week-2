const { Router } = require("express");
const router = Router();

const EventDAO = require('../daos/events');

//Gets all events
router.get("/", async (req, res, next) => {
  const event = await EventDAO.getAll();
  if(event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
})

//Gets a specific event
router.get("/:eventId", async (req, res, next) => {
  const event = await EventDAO.getById(req.params.eventId);
  if (event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
});

//Creates a new event
router.post("/", async (req, res, next) => {
  const { name, date } = req.body;
  if (!name || !date) {
    res.status(400).send('body parameter "name" and "date" are required"');
  } else {
    const event = await EventDAO.create(name, date);
    res.json(event);
  }
});

// Updates a specific event
router.put("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = req.body;
  if (!event || JSON.stringify(event) === '{}' ) {
    res.status(400).send('event is required"');
  } else {
    const updatedEvent = await EventDAO.updateById(eventId, event);
    res.json(updatedEvent)
  }
});

// Deletes a specific event
router.delete("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  try {
      await EventDAO.deleteById(eventId);
      res.sendStatus(200);

  } catch(e) {
      res.status(500).send(e.message);
  }
});

module.exports = router;