const conn = require("./db");

/**
 * Deleting a base cocktail
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function deleteBaseCocktail(req, res) {
  const { cocktailId } = req.params;

  const sql = `DELETE FROM ingredientsincocktail WHERE CocktailID = ?`;

  const values = [cocktailId];

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

        const sql2 = `DELETE FROM cocktail WHERE CocktailID = ?`;

        conn.query(sql2, [values], (err, result) => {
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
 * Deleting a forum thread for the user cocktail created
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function deletingForumOfUserCreatedCocktail(req, res) {
  const { usercocktailId } = req.params;

  const sqlGetForumPostID =
    "SELECT ForumPostID FROM usercreatedcocktails WHERE UserCocktailID = ?";

  conn.query(
    sqlGetForumPostID,
    [usercocktailId],
    function (err, resultForumPostID) {
      if (err) {
        console.error("Error fetching ForumPostID:", err);
        res.status(500).json({ error: "Error fetching ForumPostID" });
        return;
      }

      if (resultForumPostID.length === 0) {
        console.error("User cocktail not found for ID:", usercocktailId);
        res.status(404).json({ error: "User cocktail not found" });
        return;
      }

      const forumPostID = resultForumPostID[0].ForumPostID;

      const sql = "DELETE FROM addedforumpost WHERE ForumPostIDFK = ?";
      const sql2 = "DELETE FROM forum WHERE CocktailIDPlaceholder = ?";
      const values =
        "DELETE FROM usercreatedcocktails WHERE UserCocktailID = ?";

      conn.beginTransaction(function (err) {
        if (err) {
          console.error("Error starting transaction:", err);
          res.status(500).json({ error: "Error starting transaction" });
          return;
        }

        conn.query(sql, [forumPostID], function (err, result1) {
          if (err) {
            console.error("Error deleting forum post record:", err);
            return conn.rollback(function () {
              res
                .status(500)
                .json({ error: "Error deleting forum post record" });
            });
          }

          console.log(
            "Deleted forum post record with ForumPostID:",
            forumPostID
          );

          conn.query(sql2, [usercocktailId], function (err, result2) {
            if (err) {
              console.error("Error deleting forum record:", err);
              return conn.rollback(function () {
                res.status(500).json({ error: "Error deleting forum record" });
              });
            }

            console.log(
              "Deleted forum record for CocktailIDPlaceholder:",
              usercocktailId
            );

            conn.query(values, [usercocktailId], function (err, result3) {
              if (err) {
                console.error(
                  "Error deleting usercreatedcocktails record:",
                  err
                );
                return conn.rollback(function () {
                  res
                    .status(500)
                    .json({
                      error: "Error deleting usercreatedcocktails record",
                    });
                });
              }

              console.log(
                "Deleted usercreatedcocktails record for UserCocktailID:",
                usercocktailId
              );

              conn.commit(function (err) {
                if (err) {
                  console.error("Error committing transaction:", err);
                  return conn.rollback(function () {
                    res
                      .status(500)
                      .json({ error: "Error committing transaction" });
                  });
                }

                if (
                  result1.affectedRows === 0 &&
                  result2.affectedRows === 0 &&
                  result3.affectedRows === 0
                ) {
                  console.error(
                    "Cocktail not found for deletion with ID:",
                    usercocktailId
                  );
                  res
                    .status(404)
                    .json({ error: "Cocktail not found for deletion" });
                } else {
                  console.log(
                    "Cocktail deleted successfully with ID:",
                    usercocktailId
                  );
                  res
                    .status(200)
                    .json({ message: "Cocktail deleted successfully" });
                }
              });
            });
          });
        });
      });
    }
  );
}

/**
 * Deleting the entire post and all the contents within
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function removeForumPost(req, res) {
  const { forumPostID } = req.params;

  conn.beginTransaction(function (err) {
    if (err) {
      res.status(500).json({ error: "Error starting a transaction" });
      return;
    }
    const sql = "DELETE FROM addedforumpost WHERE ForumPostIDFK = ?";

    conn.query(sql, forumPostID, function (err, result) {
      if (err) {
        console.error(
          `Error removing records from addedforumpost for ForumPostID ${forumPostID}:`,
          err
        );
        conn.rollback(function () {
          console.error("Transaction rolled back.");
          res.status(500).json({
            error: `Error removing records from addedforumpost for ForumPostID ${forumPostID}`,
          });
        });
      } else {
        const sql2 = "DELETE FROM forum WHERE ForumPostID = ?";

        conn.query(sql2, forumPostID, function (err, result) {
          if (err) {
            conn.rollback(function () {
              res.status(500).json({
                error: `Error removing records from forum for ForumPostID ${forumPostID}`,
              });
            });
          } else {
            conn.commit(function (err) {
              if (err) {
                conn.rollback(function () {
                  console.error("Transaction rolled back.");
                  res
                    .status(500)
                    .json({ error: "Error committing the transaction" });
                });
              } else {
                res.status(200).json({
                  message: `Records for ForumPostID ${forumPostID} removed successfully`,
                });
              }
            });
          }
        });
      }
    });
  });
}

/**
 * Deleting a single comment post
 *
 * @param {*} req - The HTTP request object
 * @param {*} res - The HTTP response object
 */
function removeSingleFormPost(req, res) {
  const { threadID } = req.params;

  const sql = "DELETE FROM addedforumpost WHERE ThreadID = ?";

  conn.query(sql, threadID, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error removing additional post" });
      return;
    }
    res
      .status(200)
      .json({ message: `Additional post ${threadID} removed successfully` });
  });
}
module.exports = {
  deleteBaseCocktail,
  deletingForumOfUserCreatedCocktail,
  removeForumPost,
  removeSingleFormPost,
};
