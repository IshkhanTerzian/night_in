const conn = require("./db");

/**
 * Inserts a new user into the database
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function handleRegistration(req, res) {
  const { username, email, password } = req.body;

  const sql = "INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?)";
  conn.query(sql, [username, email, password], function (err, result) {
    if (err) {
      res.status(500).json({ error: "Registration failed" });
    } else {
      res.json({ message: "Registration successful" });
    }
  });
}

/**
 * Finds if the account exists to attempt login
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function handleLogin(req, res) {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE Username = ? AND Password = ?";
  conn.query(sql, [username, password], function (err, result) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else if (result.length === 1) {
      const loggedInUser = result[0];
      res.json({ message: "Login successful", user: loggedInUser });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
}

/**
 * Creates a new user cocktail
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function creatingNewUserCocktail(req, res) {
  const {
    userId,
    CocktailName,
    Description,
    Ingredients,
    Instructions,
    CocktailImage,
  } = req.body;

  const imageSrc = Buffer.from(CocktailImage, "base64");

  const sql = `INSERT INTO usercreatedcocktails (UserId, CocktailImage, CocktailName, Description, Ingredients, Instructions) VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    userId,
    imageSrc,
    CocktailName,
    Description,
    JSON.stringify(Ingredients),
    Instructions,
  ];

  conn.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Data inserted successfully" });
    }
  });
}

/**
 * Create a new base cocktail
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function creatingBaseCocktail(req, res) {
  const {
    AlcoholTypeID,
    CocktailName,
    Description,
    Ingredients,
    Instructions,
    CocktailImage,
  } = req.body;

  const imageSrc = Buffer.from(CocktailImage, "base64");

  const sql = `
    INSERT INTO cocktail (CocktailImage, CocktailName, Description, Instructions, AlcoholTypeID)
    VALUES (?, ?, ?, ?, ?)`;

  const values = [
    imageSrc,
    CocktailName,
    Description,
    Instructions,
    AlcoholTypeID,
  ];

  try {
    conn.beginTransaction((err) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      conn.query(sql, values, (err, result) => {
        if (err) {
          res.status(500).json({ error: "Internal Server Error" });
          return conn.rollback(() => {});
        }

        const cocktailID = result.insertId;

        const values2 = Ingredients.map(({ quantity, unit, ingredientID }) => [
          cocktailID,
          ingredientID,
          quantity,
          unit,
        ]);

        const sql2 = `
          INSERT INTO ingredientsincocktail (CocktailID, IngredientID, Quantity, Unit)
          VALUES ?`;

        conn.query(sql2, [values2], (err, result) => {
          if (err) {
            res.status(500).json({ error: "Internal Server Error" });
            return conn.rollback(() => {});
          }

          conn.commit((err) => {
            if (err) {
              res.status(500).json({ error: "Internal Server Error" });
              return conn.rollback(() => {});
            }

            res.status(200).json({ message: "Data inserted successfully" });
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Create a new forum post
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function createForumPosts(req, res) {
  const { userID, topicTitle, description, numberOfReplies, content } =
    req.body;

  if (!userID || !topicTitle || !description || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO forum (UserID, TopicTitle, Description, NumberOfReplies, Content) VALUES (?, ?, ?, ?, ?)";

  const values = [userID, topicTitle, description, numberOfReplies, content];

  conn.query(sql, values, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error inserting forum post" });
      return;
    }

    res.status(200).json({ message: "forum post added successfully" });
  });
}

/**
 * Creating a new forum thread
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function addNewForumThread(req, res) {
  const { userId, forumPostId } = req.params;
  const { content } = req.body;

  const sql = `INSERT INTO addedforumpost (ForumPostIDFK, UserID, Content) VALUES (?, ?, ?)`;
  const values = [forumPostId, userId, content];

  const sql2 = `UPDATE forum SET NumberOfReplies = NumberOfReplies + 1 WHERE ForumPostID = ?`;

  conn.beginTransaction(function (err) {
    if (err) {
      res.status(500).json({ error: "Error adding a new post" });
      return;
    }

    conn.query(sql, values, function (err, result) {
      if (err) {
        conn.rollback(function () {
          res.status(500).json({ error: "Error adding a new post" });
        });
      } else {
        conn.query(sql2, [forumPostId], function (err, updateResult) {
          if (err) {
            conn.rollback(function () {
              res.status(500).json({ error: "Error adding a new post" });
            });
          } else {
            conn.commit(function (err) {
              if (err) {
                conn.rollback(function () {
                  res.status(500).json({ error: "Error adding a new post" });
                });
              } else {
                res.json({ message: "New forum post added successfully" });
              }
            });
          }
        });
      }
    });
  });
}

/**
 * Creating a new forum post for a specific cocktail
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function createForumPostForCocktail(req, res) {
  const { userId, description, topicTitle, content, cocktailIDPlaceholder } =
    req.body;

  const sql = `
      INSERT INTO forum (UserID, Description, TopicTitle, Content, CocktailIDPlaceholder)
      VALUES (?, ?, ?, ?, ?)
    `;

  const values = [
    userId,
    description,
    topicTitle,
    content,
    cocktailIDPlaceholder,
  ];

  conn.query(sql, values, function (err, result1) {
    if (err) {
      res.status(500).json({ error: "Error creating forum post" });
      return;
    }

    const generatedForumPostId = result1.insertId;

    const sql2 = `
        UPDATE usercreatedcocktails 
        SET ForumPostID = ?, ForumExistsForCocktail = 'Y' 
        WHERE UserCocktailID = ?
      `;

    const values2 = [generatedForumPostId, cocktailIDPlaceholder];
    conn.query(sql2, values2, function (err, result2) {
      if (err) {
        res.status(500).json({ error: "Error updating usercreatedcocktails" });
        return;
      }

      res.status(200).json({ message: "Forum post created successfully" });
    });
  });
  res.status(500).json({ error: "Error creating forum post" });
}

/**
 * Updating a users password
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function updateUserPassword(req, res) {
  const { userId } = req.params;
  const { newPassword } = req.body;

  const sql = "UPDATE users SET Password = ? WHERE UserId = ?";
  const values = [newPassword, userId];

  conn.query(sql, values, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error updating user's password" });
      return;
    }
    res.json({ message: "Password updated successfully" });
  });
}

/**
 * Incrementing the search counter for the base cocktail searched
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function incrementCocktailSearchCounter(req, res) {
  const { cocktailId } = req.params;
  const { SearchedCounter } = req.body;

  const sql = "UPDATE cocktail SET SearchedCounter = ? WHERE CocktailID = ?";

  conn.query(sql, [SearchedCounter + 1, cocktailId], function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error incrementing SearchedCounter" });
      return;
    }
    res.json({ message: "SearchedCounter incremented successfully" });
  });
}

/**
 * Incrementing the search counter for the user created cocktail searched
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function incrementUserCocktailSearchCounter(req, res) {
  const { usercocktailId } = req.params;
  const { SearchedCounter } = req.body;

  const sql =
    "UPDATE usercreatedcocktails SET SearchedCounter = ? WHERE UserCocktailID = ?";

  conn.query(
    sql,
    [SearchedCounter + 1, usercocktailId],
    function (err, result) {
      if (err) {
        res.status(500).json({ error: "Error incrementing SearchedCounter" });
        return;
      }
      res.json({ message: "SearchedCounter incremented successfully" });
    }
  );
}

/**
 * Updating the base cocktail
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function updateBaseCocktail(req, res) {
  const { cocktailId } = req.params;
  const {
    AlcoholTypeID,
    CocktailName,
    Description,
    Instructions,
    CocktailImage,
  } = req.body;

  const imageBuffer = Buffer.from(CocktailImage, "base64");

  const sql = `
    UPDATE cocktail
    SET CocktailName = ?, Description = ?, Instructions = ?, CocktailImage = ?, AlcoholTypeID = ?
    WHERE CocktailID = ?;
  `;

  const values = [
    CocktailName,
    Description,
    Instructions,
    imageBuffer,
    AlcoholTypeID,
    cocktailId,
  ];

  conn.query(sql, values, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Registration failed" });
    } else {
      res.json({ message: "Registration successful" });
    }
  });
}

function updateUserCreatedCocktail(req, res) {
  const { usercocktailId } = req.params;
  const {
    CocktailName,
    Description,
    Instructions,
    Ingredients,
    CocktailImage,
  } = req.body;

  const imageBuffer = Buffer.from(CocktailImage, "base64");

  const sql = `
    UPDATE usercreatedcocktails
    SET CocktailName = ?, Description = ?, Instructions = ?, Ingredients = ?, CocktailImage = ?
    WHERE UserCocktailID = ?;
  `;

  const values = [
    CocktailName,
    Description,
    Instructions,
    Ingredients,
    imageBuffer,
    usercocktailId,
  ];

  conn.query(sql, values, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Registration failed" });
    } else {
      res.json({ message: "Registration successful" });
    }
  });
}

/**
 * Updating the main thread post
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function updateMainThreadPost(req, res) {
  const { forumpostId } = req.params;

  const sql =
    "UPDATE forum SET TopicTitle = ?, Content = ? WHERE ForumPostID = ?";

  const values = [req.body.TopicTitle, req.body.Content, forumpostId];

  conn.query(sql, values, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error updating forum post" });
      return;
    }
    res.json({ message: "Forum post updated successfully" });
  });
}

/**
 * Updating a single thread post
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function updateThreadPost(req, res) {
  const { threadID } = req.params;

  const sql = "UPDATE addedforumpost SET Content = ? WHERE ThreadID = ?";

  const values = [req.body.Content, threadID];

  conn.query(sql, values, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error updating forum post" });
      return;
    }
    res.json({ message: "Forum post updated successfully" });
  });
}

module.exports = {
  handleRegistration,
  handleLogin,
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
};
