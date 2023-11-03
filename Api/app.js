// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const connectMongo = require("connect-mongo");
require('dotenv').config();



// Create an instance of express
const app = express();
const mongoConn = process.env.MONGO_PRIME;
const mongoBack = process.env.MONGO_CONN;

// Promise
mongoose.Promise = global.Promise;
// Connect to database
const connectToDatabase = (connectionString) => {
  return mongoose.connect(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
};

// Try to connect to the primary MongoDB
connectToDatabase(mongoConn)
  .then(() => {
    console.log('Connected to the primary database');
  })
  .catch((primaryError) => {
    console.error('Failed to connect to the primary database:', primaryError);

    // If the primary connection fails, try to connect to the backup database
    connectToDatabase(mongoBack)
      .then(() => {
        console.log('Connected to the backup database');
      })
      .catch((backupError) => {
        console.error('Failed to connect to the backup database:', backupError);
      });
  });

const db = mongoose.connection;

// Control db errors
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connection established to database");
});
const MongoStore = connectMongo(session);
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127.0.0.1(:\d+)?$/
];

// Use sessions
app.use(
  session({
    secret: "someguy",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);
// Allow Cross-origin resourse

// Allow Cross-origin resource sharing
app.use(
  cors({
    origin: allowedOrigins, 
    methods: 'GET,POST,DELETE,PUT',
    credentials: true,
  })
);
// Read in Schemas
var Movies = require("./app/models/movies.js");
var Admin = require("./app/models/admin.js");
var Message = require("./app/models/messages.js");

// Make mongoose use 'findOneAndUpdate()'
//mongoose.set("useFindAndModify", false);

// Setup Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Get all movies
app.get("/api/:sortby/:desc", (req, res) => {
  const sortby = req.params.sortby;
  const sort = req.params.desc;
  const query = {};
  query[sortby] = sort;
  
  Movies.find({})
    .sort(query)
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Search for movies
app.get("/api/:search/:sortby/:desc", (req, res) => {
  console.log("Searching: " + req.params.search);
  const sortby = req.params.sortby;
  const sort = req.params.desc;
  const query = {};
  query[sortby] = sort;
  const searchQuery = req.params.search;
const partialMatchQuery = { $regex: searchQuery, $options: "i" };

const search = {
  $or: [
    { title: partialMatchQuery }, // Partial match for title
    { starring: partialMatchQuery },
    { director: partialMatchQuery }, 
    { genre: partialMatchQuery }, 
    // Check if 'searchQuery' is a number before searching by year
    !isNaN(searchQuery) && { year: { $eq: parseInt(searchQuery) } },
  ].filter(Boolean),
};

  Movies.find(search)
    .sort(query)
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get movie by id
app.get("/api/movie/one/:id", (req, res) => {
  Movies.findById(req.params.id)
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ message: "Movie not found" });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get movies by service
app.get("/api/movies/:service/:sortby/:desc", (req, res) => {
  const sortby = req.params.sortby;
  const sort = req.params.desc;
  const query = {};
  query[sortby] = sort;
  
  Movies.find({ available: [req.params.service] })
    .sort(query)
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get movies with two services
app.get("/api/movies/:serviceone/:servicetwo/:sortby/:desc", (req, res) => {
  const sortby = req.params.sortby;
  const sort = req.params.desc;
  const query = {};
  query[sortby] = sort;
  
  Movies.find({ available: { $in: [req.params.serviceone, req.params.servicetwo] }})
    .sort(query)
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
// Create Admin user

app.post("/api/create", async (req, res) => {
  const adminData = {
    email: req.body.email,
    password: req.body.pass,
  };

  try {
    const user = await Admin.create(adminData);
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


// login user
app.post('/api/login', async (req, res, next) => {
  try {
    console.log('login request');
    const { email, password } = req.body;

    // Authenticate the user (you may need to customize this part)
    const user = await Admin.authenticate(email, password);

    if (!user) {
      // Authentication failed
      const err = new Error('Wrong email or password.');
      err.status = 401;
      throw err;
    }

    // Authentication succeeded
    req.session.userID = user._id;
    req.session.userName = user.email;

    // Redirect to a new route (e.g., the main application)
    res.json({redirect:'/'}); // You can change the URL as needed
  } catch (error) {
    next(error);
  }
});
//Logout
app.get('/api/logged', async (req, res, next) => {

  try {
    const user = await Admin.findById(req.session.userID).exec();
    if (!user) {
      res.json({ status: 'false',user:"true" });
    } else {
      res.json({ status: 'true', user: req.session.userID });
      console.log(req.session.userID);
    }
  } catch (error) {
    res.json({ status: 'error' });
  }
});
// Add message 
app.post("/api/recipe",(req,res,next)=>{
  var message = new Message();
  message.title = req.body.title;
  message.ingredients = req.body.ingredients;
  message.website = req.body.website;
  message.save(err =>{
    if(err){res.send(err); console.log(err)}
    else{
      res.json({message:"recipe recieved"})
    }
  })
})
app.post("/api/message",(req,res,next)=>{
  let msg = req.body.message;
  let name = req.body.name;
  let email = req.body.email;
  let data = name + "\n" + email + "\n" + msg;
  fs.appendFile("/home/simonlobo/msg.txt", data, (err)=>{
    if(err) {
      res.send(err)
      console.log(err)
    }
    else {
      res.json({message:"message recieved"});
      console.log(data);
    }
  })

})
// Add movies to database
app.post("/api",async (req, res, next) => {
  console.log("Post detected id: " + req.session.userID);
  try{
    const user = await Admin.findById(req.session.userID);
    if(!user){
      let err = new Error("Not authorized");
        err.status = 400;
        return next(err);
    }else{
      console.log("success");

      // Create a new movie instance
      const movie = new Movies({
        title: req.body.title,
        year: req.body.year,
        length: req.body.length,
        desc: req.body.desc,
        director: req.body.director,
        genre: req.body.genre,
        starring: req.body.starring,
        available: req.body.available,
        url: req.body.url,
      });

      await movie.save();
      res.json({
        message: `Movie ${movie.title} added by ${user.email} to the database`,
      });
    }
  }catch(err){
    next(error);
  }
});
// Update movie
app.put("/api/update/:id", (req, res) => {
  Admin.findById(req.session.userID).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        let err = new Error("Not authorized");
        err.status = 400;
        return next(err);
      } else {
        let upID = req.params.id;
        Movies.findByIdAndUpdate(
          upID,
          {
            title: req.body.title,
            year: req.body.year,
            length: req.body.length,
            desc: req.body.desc,
            director: req.body.director,
            genre: req.body.genre,
            starring: req.body.starring,
            available: req.body.available,
            url: req.body.url
          },
          { new: true },
          function (err, movie) {
            if (err) res.send(err);
            res.json({ message: "Updated movie: " + movie.title });
          }
        );
      }
    }
  });
});

// Delete movie from database
app.delete("/api/delete/:id", (req, res, next) => {
  Admin.findById(req.session.userID).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        let err = new Error("Not authorized");
        err.status = 400;
        return next(err);
      } else {
        let delID = req.params.id;
        Movies.deleteOne({ _id: delID }, function (err, movies) {
          if (err) res.send(err);
          res.json({ message: user.email + " deleted movie" });
        });
      }
    }
  });
});
// Log out user
app.get("/api/logout", (req, res, next) => {
  if (req.session) {
    console.log("destroying session")
    // Delete session
    req.session.destroy(function (err) {
      if (err) {

        res.json({ message: "error" });
        return next(err);
      } else {
        return res.json({ message: "logged out" });
      }
    });
  }
});
//Recieve email

app.set("port", 8081);
app.listen(app.get("port"), () =>
  console.log("Server started on port " + app.get("port"))
);

