const express = require("express");
const cors = require("cors");
const app = express();
const conn = require("./db");
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post("/register", function (req, res) {
  const { username, email, password } = req.body;

  const sql = "INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?)";
  conn.query(sql, [username, email, password], function (err, result) {
    if (err) {
      console.log("Registration failed:", err);
      res.status(500).json({ error: "Registration failed" });
    } else {
      res.json({ message: "Registration successful" });
    }
  });
});

app.post("/login", function (req, res) {
  const { username, password, userType } = req.body;

  const sql = "SELECT * FROM users WHERE Username = ? AND Password = ?";
conn.query(sql, [username, password, userType], function (err, result) {
  if (err) {
    res.status(500).json({ error: "Login failed" });
  } else if (result.length === 1) {
    const loggedInUser = result[0]; 
    console.log("UserType:", loggedInUser.UserType);

    res.json({ message: "Login successful", user: loggedInUser });
  } else {
    res.status(401).json({ error: "User not found" });
  }
});
});

app.get("/recipes", function (req, res) {
  const sql =
    "SELECT CocktailImage, CocktailName, AlcoholTypeID, CocktailID FROM cocktail";
  conn.query(sql, function (err, result) {
    if (err) {
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.json(result);
    }
  });
});

app.get("/recipedetailpage/:cocktailId", function (req, res) {
  const { cocktailId } = req.params;

  const sql = `
    SELECT 
      c.CocktailID,
      c.CocktailName,
      c.Description,
      c.Instructions,
      c.CocktailImage,
      c.AlcoholTypeID,
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
});








app.post("/usercreatingcocktail/:userId", (req, res) => {
  const {
    userId,
    CocktailName,
    Description,
    Ingredients,
    Instructions,
    CocktailImage, 
  } = req.body;

  const imageSrc = Buffer.from(CocktailImage, 'base64');

  const sql = `INSERT INTO usercreatedcocktails (UserId, CocktailImage, CocktailName, Description, Ingredients, Instructions) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [userId, imageSrc, CocktailName, Description, JSON.stringify(Ingredients), Instructions];

  console.log("VALUES");
  console.log(values);
  
  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data inserted into MySQL:', result);
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.post("/admincreatingcocktail", async (req, res) => {
  const {
    AlcoholTypeID,
    CocktailName,
    Description,
    Ingredients,
    Instructions,
    CocktailImage,
  } = req.body;

  const imageSrc = Buffer.from(CocktailImage, 'base64');

  const insertCocktailSql = `
    INSERT INTO cocktail (CocktailImage, CocktailName, Description, Instructions, AlcoholTypeID)
    VALUES (?, ?, ?, ?, ?)`;

  const insertCocktailValues = [imageSrc, CocktailName, Description, Instructions, AlcoholTypeID];

  try {
    conn.beginTransaction(async (err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      conn.query(insertCocktailSql, insertCocktailValues, async (err, cocktailResult) => {
        if (err) {
          console.error('Error inserting data into cocktail table:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return conn.rollback(() => {});
        }

        const cocktailID = cocktailResult.insertId;

        const ingredientsInCocktailValues = Ingredients.map(({ quantity, unit, ingredientID }) => [
          cocktailID,
          ingredientID,
          quantity,
          unit,
        ]);

        const insertIngredientsInCocktailSql = `
          INSERT INTO ingredientsincocktail (CocktailID, IngredientID, Quantity, Unit)
          VALUES ?`;

        conn.query(insertIngredientsInCocktailSql, [ingredientsInCocktailValues], async (err, ingredientsResult) => {
          if (err) {
            console.error('Error inserting data into ingredientsincocktail table:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return conn.rollback(() => {});
          }

          conn.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              return conn.rollback(() => {});
            }

            console.log('Data inserted into MySQL:', cocktailResult, ingredientsResult);
            res.status(200).json({ message: 'Data inserted successfully' });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get("/allusercreatedcocktails", function (req, res) {
  const sql = `
    SELECT *
    FROM usercreatedcocktails
  `;

  conn.query(sql, function (err, result) {
    if (err) {
      console.error("Error fetching all user-created cocktails:", err);
      res.status(500).json({ error: "Error fetching all user-created cocktails" });
      return;
    }

    res.json(result);
  });
});









app.get("/usercreatedcocktails/:userId", function (req, res) {
  const { userId } = req.params;

  const sql = `
    SELECT *
    FROM usercreatedcocktails
    WHERE UserID = ?
  `;

  conn.query(sql, [userId], function (err, result) {
    if (err) {
      console.error("Error fetching user-created cocktails:", err);
      res.status(500).json({ error: "Error fetching user-created cocktails" });
      return;
    }

    res.json(result);
  });
});


app.get("/usercreatedcocktaildetailpage/:usercocktailId", function (req, res) {
  const { usercocktailId } = req.params; 
  console.log("Received request for userCocktailId:", usercocktailId);

  const sql = `
    SELECT *
    FROM usercreatedcocktails
    WHERE UserCocktailID = ?
  `;

  conn.query(sql, [usercocktailId], function (err, result) {
    if (err) {
      console.error("Error fetching user-created cocktail:", err);
      res.status(500).json({ error: "Error fetching user-created cocktail" });
      return;
    }

    if (result.length === 0) {
      console.error("User-created cocktail not found for ID:", usercocktailId);
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
});


app.listen(3001, function () {
  console.log(`App listening on port 3001`);
  conn.connect(function (err) {
    if (err) {
      console.log("SOMETHING WENT WRONG");
      console.log(err.message);
    }
    console.log("Database is connected");
  });
});
