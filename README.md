## Project initialisation
**Required Software**
- Node.js and NPM

Install Firebase and Firebase Tools globally with NPM:
```javascript
npm install -g firebase-tools
npm install -g firebase
```
Then log in to associate the Firebase CLI tools with your user account
```shell script
firebase login
``` 
THis should open pop open a Google login page in a browser.  AUthenticate there and the result should feed back to the CLI terminal. 

Install NPM modules in both the `\functions` and `\view` directories:
```shell script
cd ./functions
npm install
cd ../view
npm install
```

Contact me for the contents of the Config and .env files (added these to .gitignore for security)

### To run Firebase emulators locally
From the root directory:
```shell script
firebase serve
```

### To run React front end locally
From the `\view` directory:
```shell script
npm start
```

### To deploy all files (front end and API) to Firebase:
First, from the `\view` directory:
```shell script
npm run-script build
```

From the root directory:
```shell script
firebase deploy
```
 
