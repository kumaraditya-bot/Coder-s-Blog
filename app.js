const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent =
  "Developers evolve in a complex and changing environment. We can learn a lot by listening to the tales of those that have already paved a path and by meeting people who are willing to share their thoughts and knowledge about programming and technologies.";

const app = express();

//views: the directory where the template files are located
//view engine, the template engine to use.  to use the ejs template engine.

app.set('view engine', 'ejs'); //set the view engine to ejs.

app.use(express.urlencoded({extended: true}));
app.use(express.static("public")); //To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: {
    type: String,
  },
  content: {
    type: String,
  },
};

const Post = mongoose.model("Post", postSchema);
//The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. 

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose",{
    viewTitle: "Compose",
    title: req.body.postTitle,
    content: req.body.postBody
  });
  });

app.post("/compose", function(req, res){
  var post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.post("/delete", function(req, res){
  const checkedPostID = req.body.checkbox;
  Post.findByIdAndRemove(checkedPostID, function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/compose/:postID", function (req, res) {
  const composedID = req.params.postID;
  //console.log(composedID);
  Post.findById(composedID, function (err, doc) {
    if (!err) {
      res.render("compose", {
        viewTitle: "Update Blog",
        title: doc.title,
        content: doc.content
      });
    } 
    //console.log(doc._id);
  });
});

// app.post("/compose", function(req, res){
//       Post.findOneAndUpdate(
//         { _id: req.body.postID },
//         req.body,
//         { new: true },
//         (err, doc) => {
//           if (!err) {
//             res.redirect("/");
//           }
//         }
//       );
// });


app.listen(5000, function() {
  console.log("Server started on port 5000");
});
