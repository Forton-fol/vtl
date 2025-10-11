# vtmcl
Vampire: The Masquerade Character Sheet


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Deploying online

You can publish this app so others can open it in a browser. Two simple options:

- GitHub Pages (recommended for static hosting):
	1. Push this repository to GitHub (branch `main`).
	2. The repository already contains a GitHub Actions workflow at `.github/workflows/deploy-gh-pages.yml` which builds the app and deploys the `dist/static` output to GitHub Pages on push to `main`.
	3. In the repository Settings → Pages, ensure the Pages source is set to the GitHub Pages built deployment (the action will publish and configure the site).

- Netlify (drag & drop or connect to repo):
	1. Create a new site on Netlify and connect your Git repository, or upload the `dist/static` folder after running `npm run build`.
	2. Build command: `npm run build`. Publish directory: `dist/static`.

Support for shared links

This app supports loading a shared character via URL parameters. Example forms:

- Base64-encoded data embedded in URL (URL-safe base64):
	- https://your-site.example/#/charsheet?shared=<BASE64>
	- The app will decode and load the character on open.

- Remote file URL:
	- https://your-site.example/#/charsheet?sharedUrl=https%3A%2F%2Fhost%2Fchar.json
	- The app will fetch the JSON and load it (CORS must allow this).

