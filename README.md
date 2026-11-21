# Basic Login System (authentication lab-14.1)

This is a simple backend authentication API I built for the Innovate Inc. user portal lab using Node.js, Express, MongoDB, `bcrypt`, and `jsonwebtoken`. It lets users sign up with a hashed password and log in to get a JSON Web Token (JWT).

## What I Built

- **Project Setup:** Initialized a Node.js project with ES modules and installed express, mongoose, bcrypt, jsonwebtoken, and dotenv.

- **Database Connection (`server.js`):** Connected the Express app to MongoDB Atlas using MONGO_URI and a JWT_SECRET kept safe inside a .env file (and ignored in .gitignore).

- **User Model (`models/User.js`):** Created a Mongoose schema for username, email, and password. Added a `pre("save")` hook with `bcrypt` so passwords get hashed automatically before saving, plus a toJSON transform so the password never shows up in API responses.

- **Register & Login Routes (`routes/userRoutes.js`):**
  - POST /api/users/register checks if the email already exists, creates the user, and returns a `201` status.

  - POST /api/users/login checks the email, compares the password with bcrypt.compare(), and returns a signed JWT (`token`) and user info on a 200 status.

## Bugs I Ran Into & How I Fixed Them

1. **Server crashed on startup (ReferenceError: app is not defined):**
   - **What happened:** I wrote app.use(express.json()) before creating const app = express() in `server.js`.
   - **Fix:** Moved const app = express() above app.use(express.json()).

2. **500 Server Error when registering a user:**
   - **What happened:** In my async pre-save hook in User.js, I passed next and called next(), which threw an error in Mongoose.
   - **Fix:** Removed next from the async hook function in models/User.js.

3. **500 Server Error when logging in:**
   - **What happened:** I had two small typos—I wrote userSchema.method instead of userSchema.methods in User.js, and _id: user_id instead of _id: user._id in userRoutes.js.
   - **Fix:** Fixed both typos, saved the files, and restarted the server.

## How I Tested It in Postman

After fixing the bugs, I tested all endpoints in Postman:

- `GET http://localhost:3000` -> Got 200 OK with the welcome message.

- `POST http://localhost:3000/api/users/register` with a new user -> Got 201 Created and confirmed the password was hidden in the response.

- `POST http://localhost:3000/api/users/register` again with the same email -> Got 400 Bad Request ("A user with this email already exists.").

- `POST http://localhost:3000/api/users/login` with valid credentials -> Got 200 OK along with the JWT token.
- POST http://localhost:3000/api/users/login with a wrong password or unknown email -> Got 400 Bad Request ("Incorrect email or password."`).

