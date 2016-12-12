#!/bin/bash

gulp_build(){
  cd "apps/$1"
  npm install

  # remove local sda module install (in case it has been updated)
  if [ -d "bower_components/sda" ]; then
    rm -rf "bower_components/sda"
  fi

  bower install
  gulp
  cd ../..
}

copy_app(){
  rm -rf "web/$1"
  cp -r "apps/$1/dist" "web/$1"
}

gulp_build sda

APPS=(admin book-reader influence-map research themes vwise)

for APP in "${APPS[@]}"; do
  gulp_build "$APP" &
done

wait

for APP in "${APPS[@]}"; do
  copy_app "$APP"
done

cd web
bundle install
bundle exec jekyll build
cd ..
