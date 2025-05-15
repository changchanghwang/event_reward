db.createUser({
  user: "root",
  pwd: "1234",
  roles: [
    {
      role: "readWrite",
      db: "event",
    },
  ],
});

db = db.getSiblingDB("event");

db.createCollection("user");
