# About

Fishbait is a NodeJS App that emulates pages like instagram, facebook etc and phishes the user credentials

# How it works

Fishbait uses the data.json to set 2 parameters used by the application.

Parameters:

1. option
    - 1: use the instagram page
    - 2: use the facebook page
    - 3: use the given link in the url of the json to generate an on demand page
2. url gets the page at the given url

# Requirements

- NodeJS
- express
- body-parser
- request-promise
- node-html-parser
- fs

# Usage

`node app.js`

# Disclaimer
* Usage of Fishbait for attacking people's accounts without prior mutual consistency can be considered as an illegal activity. It is the final user's responsibility to obey all applicable local, state and federal laws. Authors assume no liability and are not responsible for any misuse or damage caused by this program.

# License

Fishbait is licensed under the GPLv3 license. See [LICENSE](LICENSE) for more information.

