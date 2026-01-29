# 11 - Running the App

Congratulations! You've built a complete Pokedex application. Let's put everything together and run it!

---

## Step 1: Create the Main Entry Point

1. Create a new file `src/app.js`

2. Add this code:

```javascript
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config/index.js';
import routes from './routes/index.js';

// ES Modules don't have __dirname by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const { port: PORT, nodeEnv } = config;

// ============================================
// MIDDLEWARE
// ============================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images) from public folder
app.use(express.static(join(__dirname, '../public')));

// ============================================
// VIEW ENGINE
// ============================================

// Use EJS as the template engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', join(__dirname, 'views'));

// ============================================
// ROUTES
// ============================================

// Mount all routes
app.use('/', routes);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 - Not Found
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    error: 'The page you are looking for does not exist.'
  });
});

// 500 - Server Error
app.use((err, _req, res, _next) => {
  res.status(500).render('error', {
    message: 'Something went wrong',
    error: err.message
  });
});

// ============================================
// START SERVER
// ============================================

// Only start the server if not in test mode
if (nodeEnv !== 'test') {
  app.listen(PORT, () => {
    console.log(`Pokedex server running at http://localhost:${PORT}`);
  });
}

// Export for testing
export default app;
```

3. Save the file

---

## Step 2: Start the Development Server

1. Run the development server:

```bash
npm run dev
```

2. You should see:

```
[nodemon] watching path(s): *.*
[nodemon] starting `node src/app.js`
Pokedex server running at http://localhost:3000
```

3. Open your browser to `http://localhost:3000`

---

## Step 3: Test the Application

1. **Home Page** - View the Pokemon grid at `http://localhost:3000`

2. **Pagination** - Click "Next" to see more Pokemon

3. **Search** - Type a Pokemon name and click search

4. **Filter by Type** - Click a type button to filter

5. **Detail Page** - Click a Pokemon card to see details

---

## Step 4: Test the API Endpoints

1. Open a new terminal and test the API:

```bash
# Get Pokemon list
curl http://localhost:3000/api/pokemon

# Get specific Pokemon
curl http://localhost:3000/api/pokemon/pikachu

# Search Pokemon
curl "http://localhost:3000/api/pokemon/search?q=char"

# Get types
curl http://localhost:3000/api/types
```

2. Verify you receive JSON responses

---

## Step 5: Run Final Checks

1. Stop the dev server (Ctrl+C)

2. Run all quality checks:

```bash
npm run lint
npm run format:check
npm test
```

3. All checks should pass

---

## Step 6: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "feat: add express application entry point

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```

3. Replace the name and email with your own information

---

## Step 7: Push Your Branch

1. Push your branch to GitHub:

```bash
git push -u origin your-lastname/pokedex-pull-request
```

2. Replace `your-lastname/pokedex-pull-request` with your actual branch name

3. Example:

```bash
git push -u origin dela-cruz/pokedex-pull-request
```

---

## Step 8: Create a Pull Request

1. Go to the original repository on GitHub

2. Click **Pull Requests** → **New Pull Request**

3. Click **compare across forks**

4. Select:
   - Base repository: the original repo
   - Base branch: `main`
   - Head repository: your fork
   - Compare branch: your branch (e.g., `dela-cruz/pokedex-pull-request`)

5. Click **Create Pull Request**

6. Fill in the PR details:

**Title:**
```
feat: complete pokedex application
```

**Description:**
```
## Summary
- Implemented Pokemon list with pagination
- Added search functionality
- Added type filtering
- Created detail pages for each Pokemon
- Added responsive CSS styling

## Checklist
- [ ] All tests pass (`npm test`)
- [ ] Code is formatted (`npm run format`)
- [ ] No linting errors (`npm run lint`)

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com
```

7. Click **Create Pull Request**

---

## Final Project Structure

Your completed project should look like this:

```
inter-workshop/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── guide/
├── public/
│   └── css/
│       └── style.css
├── src/
│   ├── app.js
│   ├── config/
│   │   └── index.js
│   ├── controllers/
│   │   └── pokemonController.js
│   ├── repositories/
│   │   └── pokemonRepository.js
│   ├── routes/
│   │   ├── index.js
│   │   └── pokemonRoutes.js
│   ├── services/
│   │   └── pokemonService.js
│   └── views/
│       ├── error.ejs
│       ├── index.ejs
│       ├── pokemon.ejs
│       └── partials/
│           ├── footer.ejs
│           └── header.ejs
├── tests/
│   ├── api.test.js
│   └── pokemonService.test.js
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── jest.config.js
├── package.json
└── package-lock.json
```

---

## What You've Learned

- Setting up a Node.js project with Express
- Layered architecture (Routes → Controllers → Services → Repositories)
- Server-side rendering with EJS templates
- Making HTTP requests with Axios
- Environment configuration with dotenv
- CSS Grid and responsive design
- Testing with Jest and Supertest
- Git workflow with conventional commits

---

## Troubleshooting

### "Cannot find module" Error

```bash
npm install
```

### "Port 3000 is already in use"

Change the port in `.env`:
```
PORT=3001
```

### Tests Failing

1. Check file paths in your code
2. Verify all exports are correct
3. Run `npm run lint:fix` to fix formatting

---

## Conclusion

You've built a complete full-stack web application! The skills you've learned here apply to many types of projects. Keep practicing and building!

Happy coding!
