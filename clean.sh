#!/bin/bash

declare -a folders=( "node_modules" "coverage" "build" "dist" ".swc" ".gradle" ".yarn" "tmp")

for i in "${folders[@]}"
do
  find . -name "$i" -type d -prune -exec rm -rf '{}' +
done
