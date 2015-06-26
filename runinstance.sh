sudo npm install
sudo bower install --allow-root
sudo NODE_ENV=development grunt build
sudo PORT=80 NODE_ENV=production node server.js&