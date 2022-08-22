#!/bin/bash

BACKEND_ROOT=/C/Users/ppojo/git/blog

rm $BACKEND_ROOT/src/main/webapp/WEB-INF/views/index.jsp
rm -rf $BACKEND_ROOT/src/main/webapp/resources/*

cp ./dist/favicon.ico $BACKEND_ROOT/src/main/webapp/resources/favicon.ico
cp -r ./dist/js $BACKEND_ROOT/src/main/webapp/resources
cp -r ./dist/css $BACKEND_ROOT/src/main/webapp/resources
cp -r ./dist/img $BACKEND_ROOT/src/main/webapp/resources
cp ./dist/index.html $BACKEND_ROOT/src/main/webapp/WEB-INF/views/index.jsp