  
const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/calendars/:id/events", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB)

  describe("GET /:eventId", () => {
    it("should return 404 if no matching id", async () => {
      const res = await request(server).get("/calendars/01/events/11");
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /', () => {
    it('should return a 400 without a provided name', async () => {
      const res = await request(server).post("/calendars/01/events").send({});
      expect(res.statusCode).toEqual(400);    
    });
  });

  describe('GET /:id after multiple POST /', () => {
    let event1, event2;

    beforeEach(async () => {
      event1 = (await request(server).post("/calendars/01/events").send({ name: 'event1', date: "2020-07-18T18:25:43-05:00" })).body;
      event2 = (await request(server).post("/calendars/01/events").send({ name: 'event2', date: "2020-07-18T18:25:43-05:00" })).body;
    });

    it('should return event1 using its id', async () => {
      const res = await request(server).get("/calendars/" + event1._id);
      expect(res.statusCode).toEqual(200);    
      const storedCalendar = res.body;
      expect(storedCalendar).toMatchObject({ 
        name: 'event1',
        date: "2020-07-18T18:25:43-05:00", 
        _id: event1._id 
      });
    });

    it('should return event2 using its id', async () => {
      const res = await request(server).get("/calendars/" + event2._id);
      expect(res.statusCode).toEqual(200);    
      const storedCalendar = res.body;
      expect(storedCalendar).toMatchObject({ 
        name: 'event2', 
        date: "2020-07-18T18:25:43-05:00", 
        _id: event2._id 
      });
    });
  });

  describe('GET / after multiple POST /', () => {
    let event1, event2;

    beforeEach(async () => {
      event1 = (await request(server).post("/calendars/01/events").send({ name: 'event1', date: "2020-07-18T18:25:43-05:00" })).body;
      event2 = (await request(server).post("/calendars/01/events").send({ name: 'event2', date: "2020-07-18T18:25:43-05:00" })).body;
    });

    it('should return all events', async () => {
      const res = await request(server).get("/calendars/01/events");
      expect(res.statusCode).toEqual(200);    
      const storedCalendars = res.body;
      expect(storedCalendars).toMatchObject([event1, event2]);
    });
  });

  describe('PUT /:id after POST /', () => {
    let event1;

    beforeEach(async () => {
      event1 = (await request(server).post("/calendars/01/events").send({ name: 'event1', date: "2020-07-18T18:25:43-05:00" })).body;
    });

    it('should store and return event1 with new name', async () => {
      const res = await request(server)
        .put("/calendars/01/events" + event1._id)
        .send({ name: 'new name' });
      expect(res.statusCode).toEqual(200);    

      const storedCalendar = (await request(server).get("/calendars/01/events" + event1._id)).body;
      expect(storedCalendar).toMatchObject({ 
        name: 'new name', 
        date: "2020-07-18T18:25:43-05:00",
        _id: event1._id 
      });
    });
  });

  describe('DELETE /:id after POST /', () => {
    let event1;

    beforeEach(async () => {
      event1 = (await request(server).post("/calendars/01/events").send({ name: 'event1', date: "2020-07-18T18:25:43-05:00" })).body;
    });

    it('should delete and not return event1 on next GET', async () => {
      const res = await request(server).delete("/calendars/01/events" + event1._id);
      expect(res.statusCode).toEqual(200);    
      const storedCalendarResponse = (await request(server).get("/calendars/01/events" + event1._id));
      expect(storedCalendarResponse.status).toEqual(404);
    });
  });
});