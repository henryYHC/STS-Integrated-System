# STS Integrated System

### Current version: [v0.6.1](https://github.com/henryYHC/STS-Integrated-System/releases/tag/0.6.1)

### Index

1. [Installation](logistic/md/installation.md)
2. [Components](logistic/md/components.md)
3. [Navigation](logistic/md/navigation.md)

### Introduction

This is a mobile-friendly web application that servese as an integrated system for customer instance handling at Emory Student Technology Support (STS). The system is four different sub-components, walk-in instance, check-in instance, Emory ServiceNow integration, and backend administrative panel for instance processing. The goal of this system is to replace the existing manually inputed paperworks and to provide customers as well as technician a cleaner and more friendly UI design and simpler experience at Emory STS. (Detail introductions see [components](logistic/md/components.md))

License: [MIT licene](LICENSE)

Author: Yu-Hsin (Henry) Chen [henry.chen at emory.edu]

Framework: MEAN stack (MongoDb, Express.js, Angular.js, and Node.js)

Deployed at: Emory University Student Technology Support (Coming Fall 2015)

### Updates

1. Admin panel for walk-in (Partially functional): `localhost:3000/#!/admin` (2015.06.01)
2. Walk in instance creation: `localhost:3000/#!/walkins` (2015.05.25)
3. Admin panel walk-in in edit/service functions updated (2015.06.21)
4. Admin panel user security updated. Service time log added (2015.06.22)
5. Optimized partial code structures and runtime efficiency (2015.06.22)
6. Upload scripts for run and end production instances (2015.06.26)
7. Fixed permission issue and package dependency and modularized code 
8. Version 0.1 released (2015.06.27)
9. Included user verification function for unknown first-time user registration (2015.07.10)
10. Created ServiceNow SOAP requestor for database intergration (2015.07.16)
11. Included Walk-in to House Call and instance query functions for service-modal and listing pages (2015.07.27)
12. UI/UX overhaul, switched theme to Material-Bootstrap-Design, optimized display for tablets and desktop browsers (2015.07.28)
