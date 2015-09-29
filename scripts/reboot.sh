sudo killall node
sudo git pull
sudo NODE_ENV=development grunt build
sudo PORT=80 NODE_ENV=production node server.js&