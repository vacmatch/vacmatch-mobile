[![Build Status](https://travis-ci.org/vacmatch/vacmatch-mobile.svg?branch=master)](https://travis-ci.org/vacmatch/vacmatch-mobile)

# VACmatch mobile
VACmatch mobile is a web app to manage match reports in sports from your mobile phone.

<img src="src/assets/img/logos/vacmatch.png" height="200" width="250" >

### Requirements

- Gulp
- Node.js
- PouchDB
- CouchDB up and running

### Configuration

Add your CouchDB login data in *src/app/api/config.json*

E.g.:
```json
"production" : {
},
"development" : {
  "db": {
    "username": "admin",
    "password": "admin"
  }
},

"_env": "development"
```

### Execution

Install all dependencies

```bash
npm install
```

Run the app

```bash
gulp build

gulp run
```

Navigate to `localhost:8080/#/login` in your browser, check *src/app/router.jsx* for other routes.

In development mode, login is deactivated so you can access the full app without login.

### Contributing

In order to contribute a patch (feature, bugfix, whatever), we are using a git-flow-like approach:
just fork the repo, create a `feature` or a `bugfix` branch and then send us a pull request ;)

**Master**

It's the stable version, all tests must pass before merging here.

**Development**

It's the main unstable branch where we stage the latest features.

When a new release is created, ```development``` is merged into ```master```.

### License

This file is part of VACMatch-Mobile.
VACMatch-Mobile is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of
the License, or (at your option) any later version.

VACMatch-Mobile is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the
GNU Affero General Public License along with VACMatch-Mobile.
If not, see <http://www.gnu.org/licenses/>.
