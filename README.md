# DevC Application

This repository contains the DevC mobile app.

This app requires [devc-app-server](https://github.com/DevC-Amman/devc-app-server) to run properly.

## Getting Started

These instruction 

### Prerequisites

To get the app running you need to have the following installed and setup on your machine:

* [React Native](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies)
* [Facebook SDK](https://github.com/facebook/react-native-fbsdk#3-configure-native-projects)
* [Firebase](https://github.com/evollu/react-native-fcm#configure-firebase-console)

### Installation and Setup

Clone this repository to your desired directory:

```
$ git clone https://github.com/DevC-Amman/devc-app
```

cd in to the devc-app directory and run the install script to install the dependencies:

```
$ npm install
// or
$ yarn install
```

After installing dependencies finishes, you should be able to run the app on your device using:

```
$ react-native run-android
// or
$ react-native run-ios
```

If the prerequisites and the installation are done correctly the app should open on your emulator/device.

## App Configs

To configure the app edit the ./src/Configs.js file and replace the logo assets in ./Assets.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
DevC Application
