[build]
  command = "npm run build"

[context.production]
  command = "npm start" 
  environment = { 
    DB_USER = "ishkhan",
    DB_HOST = "nightinserver.database.windows.net",
    DB_PASSWORD = "PlatinuM19941!",
    DB_DATABASE = "nightin",
    DB_PORT = "3306",
    PORT = 3001
  }