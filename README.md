# Donatia

## Built With
- [Handlebars](https://handlebarsjs.com/)
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Firebase](https://firebase.google.com/)

## Installation
### Node.js
You need to have an active Node.js installation on your laptop to run the server. We recommend to install `nvm` [(Node Version Manager)](https://github.com/nvm-sh/nvm) to manage your local Node.js builds.

To install `nvm`: 
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

To install LTS version (`node v12.18.0`) of Node.js with `nvm`:
```
nvm install 12.18.0
```

To verify the LTS version is successfully installed:
```
node -v
```

After installing Node.js, install this project's Node packages using:
```
npm install
```

Finally, to run the project, use: 

```npm start``` 

After few seconds, your local instance of the project should be available at `http://localhost:3000`.

### Google APIs

This project integrates multiple Google APIs. To get these services to work, a google cloud project must be set up with API credentials. See https://console.cloud.google.com/ for more information.

API keys are stored in the Google Cloud Project setting or local environmental variables for remote and local deployment, respectively.

## Authors

- [Daniel Abreo](https://github.com/danielabreo)
- [Sabrina Snider](https://github.com/SabrinaSnider)
- [Malcolm Jones](https://github.com/malcolmrjones)
- [Bruce Zheng](https://github.com/brucezheng)
- [Chen Yang](https://github.com/ccyang314)
