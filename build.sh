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

# resize and optimize images with mogrify if available
if [ -x "$(which mogrify)" ]; then
  cd web/_site/assets/images

  MFLAGS=( -strip -interlace Plane -sampling-factor 4:2:0 -quality 75% )

  echo "mogrify-ing images..."
  echo "(ignore any 'No such file or directory' errors)"
  mogrify $MFLAGS -resize 1200 banners{,/**}/*.{jpg,png}
  mogrify $MFLAGS -resize 600 nav-tiles{,/**}/*.{jpg,png}

  cd ../../../..
fi

# optimize pngs with optipng if available
if [ -x "$(which optipng)" ]; then
  cd web/_site/assets/images

  OPFLAGS=( -o7 -zm1-9 -fix )

  echo "optipng-ing images..."
  optipng $OPFLAGS **/*.png

  cd ../../../..
fi
