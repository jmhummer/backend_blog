import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/posts", (req, res) => {
    res.render("index.ejs", {posts: posts});
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

let posts = [];
let currentId = 0;

function findIndexById(array, idToFind) {
    
    for (let index = 0; index < array.length; index++) {
        if (array[index].id == idToFind) {
            return index;
        };
    };
    return -1;
};

app.post("/posts", (req, res) => {
    const action = req.body.action;
    //Adding a post
    if (action === "submit") {
        if (req.body.title == "" || req.body.blog == "") {
            res.status(400).send("Title and content must both be filled out.");
            return;
        }
        let newPost = {
            id: currentId++,
            title: req.body["title"],
            blog: req.body["blog"],
            date: new Date()
        };
        posts.push(newPost);
        res.render("index.ejs", {posts: posts});
    //Deleting a post
    } else if (action === "delete") {
        let targetIndex = findIndexById(posts, req.body.id);
        posts.splice(targetIndex, 1);
        res.render("index.ejs", {posts: posts});
    //Editing a post
    } else if (action === "edit") {
        let targetIndex = findIndexById(posts, req.body.id);
        const formData = {
            id: req.body.id,
            title: posts[targetIndex].title,
            blog: posts[targetIndex].blog
        };
        res.render("edit.ejs", { formData });
    //Saving an edited post
    } else if (action === "save") {
        let targetIndex = findIndexById(posts, req.body.id);
        posts[targetIndex].title = req.body["title"];
        posts[targetIndex].blog = req.body["blog"];
        posts[targetIndex].date = new Date();
        res.render("index.ejs", {posts: posts});
    } else {
        res.status(400).send('Invalid action');
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });