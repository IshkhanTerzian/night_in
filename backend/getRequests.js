const conn = require("./db");

/**
 * Retrieves all the recipes from the database
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getRecipes(req, res) {
  const sql =
    "SELECT CocktailImage, CocktailName, AlcoholTypeID, CocktailID, Description FROM cocktail";
  conn.query(sql, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.json(result);
    }
  });
}

/**
 * Gets the information about the base cocktail recipe
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getBaseDetailedRecipe(req, res) {
  const { cocktailId } = req.params;

  const sql = `
    SELECT 
      c.CocktailID,
      c.CocktailName,
      c.Description,
      c.Instructions,
      c.CocktailImage,
      c.AlcoholTypeID,
      c.SearchedCounter,
      iic.IngredientInCocktailID,
      iic.IngredientID,
      iic.Quantity,
      iic.Unit,
      i.IngredientName
    FROM cocktail AS c
    LEFT JOIN ingredientsincocktail AS iic ON c.CocktailID = iic.CocktailID
    LEFT JOIN ingredient AS i ON iic.IngredientID = i.IngredientID
    WHERE c.CocktailID = ?
  `;

  conn.query(sql, [cocktailId], function (err, result) {
    if (err) {
      console.error("Error querying cocktail information:", err);
      res.status(500).json({ error: "Error fetching cocktail information" });
      return;
    }

    if (result.length == 0) {
      console.error("Cocktail not found for ID:", cocktailId);
      res.status(404).json({ error: "Cocktail not found" });
      return;
    }

    const cocktailInfo = result[0];
    const base64Image = Buffer.from(cocktailInfo.CocktailImage).toString(
      "base64"
    );
    cocktailInfo.CocktailImageBase64 = base64Image;
    cocktailInfo.Ingredients = [];

    result.forEach((row) => {
      cocktailInfo.Ingredients.push({
        ingredientInCocktailID: row.ingredientInCocktailID,
        ingredientID: row.IngredientID,
        quantity: row.Quantity,
        unit: row.Unit,
        ingredientName: row.IngredientName,
      });
    });

    res.json(cocktailInfo);
  });
}

/**
 * Retrives all the user created cocktails from the database
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getAllUserCreatedCocktails(req, res) {
  const sql = `
    SELECT *
    FROM usercreatedcocktails
  `;

  conn.query(sql, function (err, result) {
    if (err) {
      res
        .status(500)
        .json({ error: "Error fetching all user-created cocktails" });
      return;
    }

    res.json(result);
  });
}

/**
 * Gets all the user created cocktails of the specific user
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getSpecificUserCreatedCocktail(req, res) {
  const { userId } = req.params;

  const sql = `
    SELECT *
    FROM usercreatedcocktails
    WHERE UserID = ?
  `;

  conn.query(sql, [userId], function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching user-created cocktails" });
      return;
    }

    res.json(result);
  });
}

/**
 * Gets detailed information about a single user created cocktail
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function renderDetailOfUserCreatedCocktail(req, res) {
  const { usercocktailId } = req.params;

  const sql = `
    SELECT *
    FROM usercreatedcocktails
    WHERE UserCocktailID = ?
  `;

  conn.query(sql, [usercocktailId], function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching user-created cocktail" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: "User-created cocktail not found" });
      return;
    }

    const cocktailInfo = result[0];

    const base64Image = Buffer.from(cocktailInfo.CocktailImage).toString(
      "base64"
    );

    cocktailInfo.CocktailImageBase64 = base64Image;
    res.json(cocktailInfo);
  });
}

/**
 * Retrieves all the forum posts
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getForum(req, res) {
  const sql =
    "SELECT ForumPostID, UserId, TopicTitle, Description, NumberOfReplies, CreationDate FROM forum";
  conn.query(sql, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.json(result);
    }
  });
}

/**
 * Gets the all the information about a single forum post
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getForumPostContent(req, res) {
  const { forumpostId } = req.params;

  const sql = `SELECT f.UserId, f.TopicTitle, f.Content, u.UserName, u.UserType 
                FROM forum f 
                JOIN users u ON f.UserID = u.UserID 
                WHERE f.ForumPostID = ?`;

  conn.query(sql, forumpostId, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.json(result);
    }
  });
}

/**
 * Gets the information about a users forum post
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getUsersForumPost(req, res) {
  const { forumpostId } = req.params;

  const sql = `
  SELECT afp.ThreadID, afp.UserID, afp.Content, afp.CreationDate, u.UserName
  FROM addedforumpost AS afp
  JOIN users AS u ON afp.UserID = u.UserID
  WHERE afp.ForumPostIDFK = ?
`;

  conn.query(sql, forumpostId, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.json(result);
    }
  });
}

/**
 * Gets the number of times the cocktail has been searched
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getReplyCount(req, res) {
  const sql =
    "SELECT ForumPostIDFK, COUNT(*) AS ReplyCount FROM addedforumpost GROUP BY ForumPostIDFK";

  conn.query(sql, function (err, rows) {
    if (err) {
      res.status(500).json({ error: "Error fetching reply counts:" });
    } else {
      const replyCounts = {};
      rows.forEach((row) => {
        replyCounts[row.ForumPostIDFK] = row.ReplyCount;
      });
      res.json(replyCounts);
    }
  });
}

/**
 * Gets the users current password from the database
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getUserPassword(req, res) {
  const { userId } = req.params;
  const sql = "SELECT Password FROM users WHERE UserId = ?";

  conn.query(sql, userId, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error getting user's password" });
      return;
    }

    if (!result || result.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(result[0].Password);
  });
}

/**
 * Gets the information of the user
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getUserInfo(req, res) {
  const { userId } = req.params;

  const sql = "SELECT * FROM users WHERE UserId = ?";

  conn.query(sql, userId, function (err, result) {
    if (err) {
      return;
    }
    res.json(result);
  });
}

/**
 * Gets all the information about a single thread post
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getSingleThreadPost(req, res) {
  const { threadID } = req.params;

  const sql = "SELECT Content FROM addedforumpost WHERE ThreadID = ?";

  conn.query(sql, threadID, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error updating forum post" });
      return;
    }
    res.json(result);
  });
}

/**
 * Gets all the current active users to be used in the Metrics of admins
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getTotalActiveUserCount(req, res) {
  const sql = "SELECT COUNT(*) AS totalActiveUsers FROM users";

  conn.query(sql, function (countErr, countResult) {
    if (countErr) {
      res.status(500).json({ error: "Error fetching total count" });
    } else {
      const totalActiveUsers = countResult[0].totalActiveUsers;

      const sql2 = "SELECT CreationDate FROM users";

      conn.query(sql2, function (err, result) {
        if (err) {
          res.status(500).json({ error: "Error fetching creation dates" });
        } else {
          const creationDates = result.map((row) => row.CreationDate);

          const data = {
            totalActiveUsers,
            creationDates,
          };

          res.json(data);
        }
      });
    }
  });
}

/**
 * Gets the most searched base cocktail to be used in the Metrics of admins
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getMostBaseCocktailSearched(req, res) {
  const sql = "SELECT * FROM cocktail";

  conn.query(sql, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching all cocktails" });
    } else {
      res.json(result);
    }
  });
}

/**
 * Gets the most searched user created cocktail to be used in the Metrics of admins
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getMostUserSearchedCocktails(req, res) {
  const sql = "SELECT * FROM usercreatedcocktails";

  conn.query(sql, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching all cocktails" });
    } else {
      res.json(result);
    }
  });
}

/**
 * Gets the most commented thread to be used in the Metrics of admins
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function getMostCommentedThread(req, res) {
  const sql = "SELECT * FROM forum";

  conn.query(sql, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching all cocktails" });
    } else {
      res.json(result);
    }
  });
}

module.exports = {
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
};
