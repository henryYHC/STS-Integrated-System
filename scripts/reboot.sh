sudo killall node
sudo git pull

echo 'File cache removed'
find . -name '*~' -delete

sudo NODE_ENV=development grunt build
sudo PORT=80 NODE_ENV=production node server.js > ../server.out 2> ../server.err &
