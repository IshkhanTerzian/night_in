const express = require("express");
const cors = require("cors");
const app = express();
const conn = require("./db");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
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
  updateRatings, 
  updateBannerHeading
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
  getUpdatedBannerImage
} = require("./getRequests");

const {
  deleteBaseCocktail,
  deletingForumOfUserCreatedCocktail,
  removeForumPost,
  removeSingleFormPost,
} = require("./deleteRequests");

// ALL POSTS HERE
app.post("/", handleLogin);
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
app.post("/updateRatings", updateRatings);
app.post("/updatebanner", updateBannerHeading);

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
app.get("/updatedBannerImage", getUpdatedBannerImage);

// ALL DELETES HERE
app.delete("/recipedetailpage/:cocktailId", deleteBaseCocktail);
app.delete(
  "/usercreatedcocktaildetailpage/:usercocktailId",
  deletingForumOfUserCreatedCocktail
);
app.delete("/removeforumpost/:forumPostID", removeForumPost);
app.delete("/removeaddedpost/:threadID", removeSingleFormPost);

app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
  conn.connect(function (err) {
    if (err) {
      console.log(err.message);
    }
    console.log("Database is connected");
  });
});