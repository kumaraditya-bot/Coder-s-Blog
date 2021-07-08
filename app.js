const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent =
  "Developers evolve in a complex and changing environment. We can learn a lot by listening to the tales of those that have already paved a path and by meeting people who are willing to share their thoughts and knowledge about programming and technologies.";

const app = express();

app.set('view engine', 'ejs'); 

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

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
  
  Post.findById(composedID, function (err, doc) {
    if (!err) {
      res.render("compose", {
        viewTitle: "Update Blog",
        title: doc.title,
        content: doc.content
      });
    } 
   
  });
});

app.listen(5000, function() {
  console.log("Server started on port 5000");
});
