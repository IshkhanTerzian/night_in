const express = require("express");
const cors = require("cors");
const app = express();
const conn = require("./db");
const bodyParser = require("body-parser");
const dontenv = require("dotenv").config();

const DB_PORT = process.env.DB_PORT;

app.use(
  cors({
    origin: "https://night-in.xyz",
  })
);
app.use(express.json());
app.use(bodyParser.json());

const {
  handleLogin,
  handleRegistration,
  creatingNewUserCocktail,
  creatingBaseCocktail,
  createForumPosts,
  addNewForumThread,
  createForumPostForCocktail,
  updateUserPassword,
  incrementCocktailSearchCounter,
  incrementUserCocktailSearchCounter,
  updateBaseCocktail,
  updateUserCreatedCocktail,
  updateMainThreadPost,
  updateThreadPost,
} = require("./postRequests");

const {
  getRecipes,
  getBaseDetailedRecipe,
  getAllUserCreatedCocktails,
  getSpecificUserCreatedCocktail,
  renderDetailOfUserCreatedCocktail,
  getForum,
  getForumPostContent,
  getUsersForumPost,
  getReplyCount,
  getUserPassword,
  getUserInfo,
  getTotalActiveUserCount,
  getMostBaseCocktailSearched,
  getMostUserSearchedCocktails,
  getMostCommentedThread,
  getSingleThreadPost,
} = require("./getRequests");

const {
  deleteBaseCocktail,
  deletingForumOfUserCreatedCocktail,
  removeForumPost,
  removeSingleFormPost,
} = require("./deleteRequests");

// ALL POSTS HERE
app.get("/login", handleLogin);
app.post("/register", handleRegistration);
app.post("/usercreatingcocktail/:userId", creatingNewUserCocktail);
app.post("/admincreatingcocktail", creatingBaseCocktail);
app.post("/creatingforumpostpage", createForumPosts);
app.post("/forumpostcontentpage/:userId/:forumPostId", addNewForumThread);
app.post("/createforumpostforcocktail", createForumPostForCocktail);
app.post("/updatepassword/:userId", updateUserPassword);
app.post(
  "/incrementSearchedCounter/:cocktailId",
  incrementCocktailSearchCounter
);
app.post(
  "/incrementUserSearchedCounter/:usercocktailId",
  incrementUserCocktailSearchCounter
);
app.post("/updateCocktail/:cocktailId", updateBaseCocktail);
app.post(
  "/updateUserCreatedCocktail/:usercocktailId",
  updateUserCreatedCocktail
);
app.post("/updateMainThreadPost/:forumpostId", updateMainThreadPost);
app.post("/updatethreadpost/:threadID", updateThreadPost);

// ALL GETTERS HERE
app.get("/recipes", getRecipes);
app.get("/recipedetailpage/:cocktailId", getBaseDetailedRecipe);
app.get("/allusercreatedcocktails", getAllUserCreatedCocktails);
app.get("/usercreatedcocktails/:userId", getSpecificUserCreatedCocktail);
app.get(
  "/usercreatedcocktaildetailpage/:usercocktailId",
  renderDetailOfUserCreatedCocktail
);
app.get("/forum", getForum);
app.get("/forumpostcontentpage/:forumpostId", getForumPostContent);
app.get("/userforumpost/:forumpostId", getUsersForumPost);
app.get("/forum/replyCounts", getReplyCount);
app.get("/password/:userId", getUserPassword);
app.get("/userinfo/:userId", getUserInfo);
app.get("/totalActiveUsers", getTotalActiveUserCount);
app.get("/mostBaseCocktailSearched", getMostBaseCocktailSearched);
app.get("/mostUserSearchedCocktails", getMostUserSearchedCocktails);
app.get("/mostCommentedThread", getMostCommentedThread);
app.get("/getSingleThreadPost/:threadID", getSingleThreadPost);

// ALL DELETES HERE
app.delete("/recipedetailpage/:cocktailId", deleteBaseCocktail);
app.delete(
  "/usercreatedcocktaildetailpage/:usercocktailId",
  deletingForumOfUserCreatedCocktail
);
app.delete("/removeforumpost/:forumPostID", removeForumPost);
app.delete("/removeaddedpost/:threadID", removeSingleFormPost);

app.listen(DB_PORT, function () {
  console.log(`App listening on port ${DB_PORT}`);
  conn.connect(function (err) {
    if (err) {
      console.log(err.message);
    }
    console.log("Database is connected");
  });
});
