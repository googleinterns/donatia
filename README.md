# Donatia

Researching nonprofit organization to donate to can be tedious. There are roughly 1.5 million nonprofit organizations in the United States, each with their own mission, acceptable donation items, and methods for donating. With so much variety, it can be difficult to find the best organization that seeks your donation item and whose donation process is convient for you.

Donatia simplifies this process by providing an online platform to let donors filter through find organizations easily. By creating a streamlined way to discover nonprofit organizations, we hope to reduce waste and increase donations.

[Donatia App](https://gsi-step-capstone.wl.r.appspot.com/)

![image](https://user-images.githubusercontent.com/10712922/87168036-e707f800-c29b-11ea-8d43-698253bdef57.png)

![image](https://user-images.githubusercontent.com/10712922/87168160-1159b580-c29c-11ea-8e95-333a9945adc6.png)

![image](https://user-images.githubusercontent.com/10712922/87168250-32220b00-c29c-11ea-81bc-e63f0a46c705.png)

## Built With

- [Handlebars](https://handlebarsjs.com/)
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Google Cloud Firestore](https://cloud.google.com/firestore)

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

`npm start`

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
