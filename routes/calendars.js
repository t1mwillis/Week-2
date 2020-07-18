const { Router } = require("express");
const router = Router();

const CalendarDAO = require('../daos/calendars');

//Gets all calendars
router.get("/", async (req, res, next) => {
  const calendar = await CalendarDAO.getAll();
  if(calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
})

//Gets a specific calendar
router.get("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.getById(req.params.id);
  if (calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
});

//Creates a new calendar
router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
  } else {
    const calendar = await CalendarDAO.create(name);
    res.json(calendar);
  }
});

// Updates a specific calendar
router.put("/:id", async (req, res, next) => {
  const calendarId = req.params.id;
  const calendar = req.body;
  if (!calendar || JSON.stringify(calendar) === '{}' ) {
    res.status(400).send('calendar is required"');
  } else {
    const updatedCalendar = await CalendarDAO.updateById(calendarId, calendar);
    res.json(updatedCalendar)
  }
});

// Deletes a specific calendar
router.delete("/:id", async (req, res, next) => {
  const calendarId = req.params.id;
  try {
      await CalendarDAO.deleteById(calendarId);
      res.sendStatus(200);

  } catch(e) {
      res.status(500).send(e.message);
  }
});

module.exports = router;