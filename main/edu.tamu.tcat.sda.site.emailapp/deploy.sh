#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd $DIR

if [ -f "$DIR/composer.phar" ]; then
    echo "Found existing local composer.phar. Updating to latest version..."
    php composer.phar self-update
else
    echo "Installing local composer.phar (getcomposer.org)..."
    curl -sS https://getcomposer.org/installer | php
fi

echo "Installing/Updating PHP vendors..."
php composer.phar install

echo "Performing database migration..."
php app/console doctrine:migrations:migrate --env=prod --no-debug --no-interaction

echo "Clearing production cache..."
php app/console cache:clear --env=prod --no-debug --no-warmup
