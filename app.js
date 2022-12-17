//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//creating a db named blogs
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/blogs");

const blogSchema = new mongoose.Schema({
  blogTitle: String,
  article: String
});

const Blog = mongoose.model("Blog",blogSchema);

const blog = [
  {
    blogTitle:"day1",
    article:"this is the article for the first day"
  },
  {
    blogTitle:"day2",
    article:"this is the article for the second day"
  },
  {
    blogTitle:"day3",
    article:"this is the article for the third day"
  }
];



app.get("/",function(req,res){

  Blog.find({},function(err,blogs){
 
    if(blogs.length == 0){
      //inserting the element in the Blog collection-----------
      Blog.insertMany(blog, function(err){
        if(!err){
          console.log("successfully saved");
          res.redirect("/");
        }else{
          console.log(err);
        }
      });

    }
    else{

      res.render("home",{homeStartingContent:homeStartingContent,posts:blogs});
      
    }

  })
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

//learning anout route parametering 
app.get("/post/:postName",function(req,res){
  const requestedTitle = req.params.postName;
  Blog.findOne({blogTitle:requestedTitle},function(err,blog){
    if(!err){
      if(!blog){
        res.redirect("/compose");
      }else{
        res.render("post",{Title:blog.blogTitle , content:blog.article});
      }
    }
  })
});

//making a post request to compose page to get the input text 
app.post("/compose",function(req,res){
  const title = req.body.textTitle;
  const content = req.body.textBody;

  const newBlog = new Blog({
    blogTitle:title,
    article:content
  });

  newBlog.save();
  res.redirect("/");
})

app.post("/delete",function(req,res){
  const postId = req.body.checkbox;
  Blog.findByIdAndDelete(postId , function(err,resPost){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
