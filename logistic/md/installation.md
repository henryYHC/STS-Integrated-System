## Installation Guide

### For Linux systems

#### MEAN stack framework setup

1. Install Node: [Click here](https://nodejs.org/download/)
2. Install MongoDB: [Click here](http://www.mongodb.org/downloads) 
3. Install Bower :

		npm install -g bower

4. Install Grunt:
		
		npm install
		npm install -g grunt-cli

5. Clone this repo to you destination directory

		cd /../../DESTINATION
		git clone https://github.com/henryYHC/STS_IntegratedSystem.git
		

#### How to Run

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
		
#### How to Update Package Dependencies

1. Update node package dependency
		
		npm install --save --save-dev
		
2. Update bower package dependency

		bower install --allow-root
		
#### Notes
1. Please set up your credential json files under `app/credentials/` (See `ExampleCredential.json` for template)

2. Please comment out the line in Angular-Touch javascript file (`public/lib/angular-touch/angular-touch.js`) to ensure input fields will focus correctly in the walk-in service modal with mobile devices

		event.target && event.target.blur && event.target.blur();