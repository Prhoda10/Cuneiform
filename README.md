# Cuneiform

# Webpack information
- can't use any javascript in html
- after you make changes in js, compile by:
    $ npx webpack
- ^ this compiles all the entry point js files (index.js, etc) into main.js that is visible to the html files

# Firebase information
- test the website by:
    $ firebase emulators:start
- when things are working, deploy the website by:
    $ firebase deploy --only hosting -m "deploying the best new feature ever."
- then, it should be working at this address accessible by everyone:
    https://cuneiform-99812.web.app/
