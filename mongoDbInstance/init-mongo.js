db.createUser(
    {
        user: "testuser",
        pwd: "testpassword",
        roles: [
            {
                role: "readwrite",
                db: "testdb"
            }
        ]
    }
)