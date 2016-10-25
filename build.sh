#!/bin/bash

APPS=(admin book-reader concept-browser library reader vwise)

cd apps
for APP in "${APPS[@]}"; do
  cd "$APP"
  npm install
  bower install
  gulp
  cd ..
done
cd ..

for APP in "${APPS[@]}"; do
  cp -r "apps/$APP/dist" "web/$APP"
done

cd web
bundle install
bundle exec jekyll build
cd ..
