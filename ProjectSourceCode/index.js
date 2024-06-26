// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
const multer = require('multer'); // used for image upload
const fs = require('fs');

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  helpers : {
    fixDate : sqlDate => {
      var jsDate;
      if (sqlDate) jsDate = new Date(sqlDate);
      else return;

      return `${jsDate.toLocaleDateString()}`;
    }
  }
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });



// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

app.use('/resources', express.static(path.join(__dirname, 'resources'))); // allows use of locally saved imgs

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const user = {
  username: "",
  admin: false
};

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({ storage });


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', function (req, res) {
  // Define a default user object
  const defaultUser = {
    username: "",
    admin: false
  };

  // Check if req.user and req.session.user exist before trying to access their properties
  const username = req.user ? req.user.username : defaultUser.username;
  const admin = req.session && req.session.user ? req.session.user.admin : defaultUser.admin;

  // Render the blog page with either the logged-in user's info or the default user info
  res.redirect('/blog');
});

app.get('/test', function (req, res) {
    res.redirect('/login');
  });

app.get('/login', function (req, res) {
  res.render('pages/login');
});

app.get('/register', function (req, res) {
  res.render('pages/register');
});

app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
  
    // To-DO: Insert username and hashed password into the 'users' table
    const username = req.body.username;
    const query = 'INSERT INTO users (username, password, admin) VALUES($1, $2, false) RETURNING *;';
    
    db.one(query, [username, hash])
        .then(data => {
          res.redirect('/login');
        
        })
        .catch(err => {
        console.log(err);
        res.redirect('/register');
        
        });
    });

app.post('/login', async (req, res) => {
  /*
find the user fromt he users table where the username is the same as the one entered by the user.
use bcrypt.compare to encrypt the password enetered from the user and compare if the entered password is the same as the registered one.
if the password is incorrect, render the login page and send a message to the user stating incorrect username or password
else, save the user in the session variable
*/

  try {
    const login_user = await db.one('SELECT * FROM users WHERE username = $1;', [req.body.username]);
    const match = await bcrypt.compare(req.body.password, login_user.password);
    
    if (match) {
      user.username = login_user.username;
      req.session.user = user;
      req.session.user.admin = login_user.admin;
      req.session.save();
      // console.log("scucessful login");
      res.redirect('/blog');
    } else {
      res.render('pages/login' ,{
        message: `Incorrect username or password.`
      });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.redirect('/register'); // Redirect to register page if there's an error
  }

});

app.get('/home', function (req, res) {
  // const defaultUser = {
  //   username: "",
  //   admin: false
  // };
  const username = req.session.user ? req.session.user.username : null;

  // Check if req.user and req.session.user exist before trying to access their properties
  const admin = req.session.user ? req.session.user.admin : false;

  const renderOptions = {
    username: username, // This will be null if user is not logged in
    admin: admin // Handle admin flag
  };
  res.render('pages/home', renderOptions);
});

app.get('/bingo', function (req, res) {
  const username = req.session.user ? req.session.user.username : null;

  const admin = req.session.user ? req.session.user.admin : false;

  db.any('SELECT * FROM bingo;')
  .then(bingo => {
    // console.log(bingo);
    const renderOptions = {
      username: username, // This will be null if user is not logged in
      admin: admin,
      bingo_data: bingo // Handle admin flag
    };

    res.render('pages/bingo', renderOptions);
  })
  .catch(err => {
    console.log(err);
    console.log("You are an idiot and  a failure");
  })
});

app.get('/blog', function (req, res) {
  console.log("rendering blog")
  const username = req.session.user ? req.session.user.username : null;
  const message = req.query.message
  db.any(`
  SELECT 
    p.post_id,
    p.caption, 
    p.date_created, 
    p.image_filepath,
    (SELECT COUNT(username) FROM likes l WHERE l.post_id = p.post_id) as like_count,
    EXISTS (
        SELECT 1 FROM likes l WHERE l.post_id = p.post_id AND l.username = $1
    ) AS liked,
    json_agg(
        json_build_object(
            'username', c.username, 
            'body', c.body, 
            'date_created', c.date_created,
            'post_id', c.post_id
        ) 
        ORDER BY c.date_created DESC
    ) AS comments
  FROM 
    posts p 
  LEFT JOIN 
    comments c ON c.post_id = p.post_id
  GROUP BY 
    P.post_id, 
    p.caption, 
    p.date_created, 
    p.image_filepath
  ORDER BY 
    p.date_created DESC;`, [username])

    .then(posts => {
      const renderOptions = {
        posts,
        message,
        username: username, // This will be null if user is not logged in
        admin: req.session.user ? req.session.user.admin : false // Handle admin flag
      };
      res.render('pages/blog', renderOptions);
    })
    .catch(err => {
      console.log(err);
      res.render('pages/blog', {
      error: true,
      message: 'Error getting posts',
      username: req.session.user.username});
    });
});

app.get('/user', function(req,res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const user_query = `SELECT *
  FROM users
  WHERE username = '${req.query.username}';`;
  
  const post_query = `SELECT *
  FROM posts
  INNER JOIN recipes
  ON posts.recipe_id = recipes.recipe_id
  WHERE posts.author = '${req.query.username}'
  ORDER BY posts.date_created DESC;
  `;

  db.task('get-everything', task => {
    return task.batch([
      task.any(user_query),
      task.any(post_query)
    ])
  })
  .then (userdata => {
    // console.log(userdata)
    res.render('pages/user', 
    {user: userdata[0][0].username, 
      posts: userdata[1],
      username: req.session.user.username,
      admin: req.session.user.admin,
      self: req.query.self,
      message: req.query.message
      });
    // add followers, posts when we figure out db issues
  })
  .catch (error => {
    console.log(error)
    res.render('pages/home', {username: req.session.user.username, admin: req.session.user.admin, message: "Error: User not found"});
  });
  
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.log("You fucked up the file upload")
    return res.status(400).send('No file uploaded.');
  }
  console.log("file uploaded successfully")
  res.status(200).send({ url: `uploads/${req.file.filename}` });
});


// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);


app.get('/post', function (req, res) {
  // console.log(req.session.user.admin);
  if (req.session.user.admin){
    res.render('pages/post', {
      username: req.session.user.username,
      admin: req.session.user.admin
    });
  }

  else {
    res.redirect('/home', {username: req.session.user.username,
      admin: req.session.user.admin, message: "Post permission denied."});
  }
});

//  app.post('/create-post', async (req, res) => { //post
//   try {
//     const body = req.body.body;
//     const date_created = new Date();
//     const caption = req.body.caption;
//     const image_filepath = 'uploads/' + req.body.image;
//     let bingo_id = null;
//     if (req.body.bingo_id){
//       bingo_id = req.body.bingo_id;
//     }
//     console.log(req.body)

//     db.none('INSERT INTO posts (caption, date_created, image_filepath, bingo_id) VALUES ($1, $2, $3, $4)', [caption, date_created, image_filepath, bingo_id]);
//     res.redirect('/blog');
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.redirect('/blog');
//   }
// });


app.post('/create-post', upload.single('image'), async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).send('No file uploaded.');
  }
  const caption = req.body.caption; // Assuming you have a caption field in your form
  const imageFilename = 'uploads/' + req.file.filename; // Accessing the filename of the uploaded file
  const date_created = new Date();
  const bingo_id = req.body.bingo_id;
  // Here you can use both caption and imageFilename to insert into your database or perform other actions
  console.log("File uploaded successfully", { caption, imageFilename });

  // Example: Insert into database (pseudo code)
  // await db.insert('posts', { caption, imageFilename });
  db.none('INSERT INTO posts (caption, date_created, image_filepath, bingo_id) VALUES ($1, $2, $3, $4)', [caption, date_created, imageFilename, bingo_id]);
  // res.status(200).send({ message: "Post created successfully", url: `uploads/${imageFilename}` });
  res.redirect('/blog');
});



app.post('/like-post', async (req, res) => { //like
  try {
    const { post_id, username } = req.body;
    const existingLike = await db.oneOrNone('SELECT * FROM likes WHERE post_id = $1 AND username = $2', [post_id, username]);
    if (existingLike) {
      await db.none('DELETE FROM likes WHERE post_id = $1 AND username = $2', [post_id, username]);
      res.redirect('/home?message=Like%20removed');
    } else {
      await db.none('INSERT INTO likes (post_id, username) VALUES ($1, $2)', [post_id, username]);
      res.redirect('/home?message=Post%20liked');
    }
  } catch (error) {
    console.error('Error liking post:', error);
    res.redirect('/home?message=Error%20liking%20post');
  }
});

app.post('/comment-post', function (req, res) {
  const date_ = new Date();
  const query =
    'insert into comments (post_id, username, body, date_created) values ($1, $2, $3, $4)  returning * ;';
  db.any(query, [
    req.body.post_id,
    req.body.username,
    req.body.comment,
    date_
  ])
    .then(function (data) {
      // console.log(data)
      res.redirect('/home?message=Comment%20posted');
    })
    .catch(function (err) {
      console.error('Error commenting on post:', err);
      res.redirect('/home?message=Comment%20posted');
    });
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/login', {message: "Logged out"});
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports=app.listen(3000)
console.log('Server is listening on port 3000');


// *****************************************************
// <!-- MISC FUNCTIONS -->
// *****************************************************

//converts SQL TIMESTAMP datatype to MM/DD/YYYY format
const formatSQLDate = (sqlTimeStamp) => {
  const jsDate = new Date(sqlTimeStamp);

  return `${jsDate.toLocaleDateString()}`;
}
