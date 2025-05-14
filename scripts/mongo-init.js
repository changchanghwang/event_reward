db.createUser({
  user: "root",
  pwd: "1234",
  roles: [
    {
      role: "readWrite",
      db: "auth",
    },
  ],
});

db = db.getSiblingDB("auth");

db.createCollection("user");
