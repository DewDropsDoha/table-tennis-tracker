## Project Setup

### Prerequisites

- Node.js and npm installed

### Steps to Create and Run the Project Locally

1. **Create React App**

   ```bash
   npx create-react-app table-tennis-tracker
   cd table-tennis-tracker
   ```

2. **Run the App Locally**
   ```bash
   npm start
   ```

## Git Setup and Initial Commit

1. **Initialize Git Repository**

   ```bash
   git init
   ```

2. **Add Remote Repository**
   Replace `username/repo-name` with your GitHub username and repository name.

   ```bash
   git remote add origin https://github.com/username/repo-name.git
   ```

3. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```
   - If there's a history conflict, merge with the main branch:
     ```bash
     git merge main --allow-unrelated-histories
     ```

## Building and Preparing for Deployment

1. **Create a `MatchMaker` Component**

   - Add a new component named `MatchMaker` in `src/components` and import it into `App.js`.

2. **Install `gh-pages` for Deployment**
   ```bash
   npm install gh-pages --save-dev
   ```

## Configuring Deployment for GitHub Pages

1. **Update `package.json`**

   - **Add `homepage` Field**: This setting is necessary to ensure that all asset paths in the build output include the repository name. Since GitHub Pages serves your app from a subdirectory (your repository), setting the `homepage` to `https://username.github.io/repo-name/` allows the app to access resources from the correct path.

     ```json
     "homepage": "https://username.github.io/table-tennis-tracker/"
     ```

   - **Add Deployment Scripts**: Add deployment commands under `"scripts"` to automate the build and deploy process:
     ```json
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
     ```

## Deploying the App to GitHub Pages

1. **Deploy**

   - Run the following command to deploy the app to GitHub Pages:
     ```bash
     npm run deploy
     ```

2. **Access the Live App**
   - Your app will be accessible at:
     ```
     https://username.github.io/table-tennis-tracker/
     ```

---

### Author

- [Ali Haider Doha](https://github.com/DewDropsDoha)
