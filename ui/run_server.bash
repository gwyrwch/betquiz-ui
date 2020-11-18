#!/bin/bash

npm i
npx webpack js/App.js
npx http-server -p 80
