#!/bin/bash

cd posts
bundle install
jekyll build
mv _site ..
cd ..
mv _site blog
