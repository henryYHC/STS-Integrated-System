# STS_IntegratedSystem
### Updates
1. Admin panel for walkin (Partially functional): `localhost:3000/#!/admin` (2015.06.01)
2. Walk in instance creation: `localhost:3000/#!/walkins` (2015.05.25)
3. Admin panel walkin in edit/service functions updated (2015.06.21)
4. Admin panel user security updated. Service time log added (2015.06.22)
5. Optimized partial code structures and runtime efficiency (2015.06.22)
6. Upload scripts for run and end produnction instances (2015.06.26)
7. Fixed permission issue and package dependency and modularized code 
8. Version 0.1 released (2015.06.27)

### Intsallaion guide for Mac
1. Install Node: [Click here](https://nodejs.org/download/)
2. Install MongoDB: [Click here](http://www.mongodb.org/downloads) 
3. Install Bower :

		npm install -g bower

4. Install Grunt:
		
		npm install
		npm install -g grunt-cli
		
5. Clone this repo to you destinated directory

		cd /../../DESTINATION
		git clone https://github.com/henryYHC/STS_IntegratedSystem.git
		
### How to Run
1. Navigate to the project directory

		cd /../../STS_IntegratedSystem
		
2. Initialize a MongoDB instance (port set to 27017) 
   Important: User needs to have read/write permissions to /data/db/ folder

		mongod
	
3. Set the environment variable to development then grunt

		NODE_ENV=development grunt
		
	For deployment: (First build then run the instance)
		
		NODE_ENV=development grunt build
		(PORT=80) NODE_ENV=production node server.js(&)
	
	You can specify port number here (might need sudoer permission). Add & at the end to screen the instance.
		
4. Open your browser and connect to 

		http://localhost:3000/
		
### How to Update after Pull
1. Update node package dependency
		
		npm install --save --save-dev
		
2. Update bower package dependecy

		bower install --allow-root
