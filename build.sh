#!/bin/bash

cd posts
jekyll build
cd posts
bundle install
jekyll build
mv _site ..
cd ..
mv _site blog
