# STS_IntegratedSystem
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
	
3. Set the environment variable to dev then grunt

		export NODE_ENV=development
		grunt
		
4. Open your browser and connect to 

		http://localhost:3000/
