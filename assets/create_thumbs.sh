#!/usr/bin/env bash

for file in ./pictures/*
do
  # next line checks the mime-type of the file
  IMAGE_TYPE=`file --mime-type -b "$file" | awk -F'/' '{print $1}'`
  if [ "x$IMAGE_TYPE" == "ximage" ]; then

    WIDTH=`imageinfo --width "$file"`      # obtaining the image width
    HEIGHT=`imageinfo --height "$file"`    # obtaining the image height

   #This line convert the image in a 200 x 150 thumb 
   convert -sample 450x "$file" "$(dirname "$file")/../thumbs/$(basename "$file")" 
  fi
done