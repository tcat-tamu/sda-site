#!/bin/bash

gulp_build(){
  cd "apps/$1"
  npm install
  bower install
  gulp
  cd ../..
  rm -rf "web/$1"
  cp -r "apps/$1/dist" "web/$1"
}

APPS=(admin book-reader influence-map research themes vwise)

for APP in "${APPS[@]}"; do
  gulp_build "$APP" &
done

wait

cd web
bundle install
bundle exec jekyll build
cd ..
