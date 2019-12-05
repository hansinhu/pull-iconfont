#!/bin/bash

echo "Start Downloading Iconfont====="

curl -v --cookie "YOUR_PROJECT_COOKIE --output download.zip

echo "Start Unzip Iconfont===="

unzip download.zip

echo "Start Clean OLD Iconfont====="

cd ../source/styles/iconfont
rm -rf icon*

cd ../../../script

echo "Start Copy New Iconfont====="
cp font*/icon* ../source/styles/iconfont

echo "Start Clean download And Zip"

rm -rf download.zip
rm -rf font_*

echo "Done"
