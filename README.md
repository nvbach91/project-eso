# ESO - Enterprise Self-Ordering system for restaurants and gastro
A cross-platform self-ordering system for browsers

## Technologies
- Node.js (v12.7.0, also works with 6.17.0)
- Express (4.16.0)
- MongoDB (4.0.9) TBI

## Quickstart
#### 1) MongoDB local database setup
- [Install](https://www.mongodb.com/download-center/community) MongoDB Server  
- Create path `C:\data\db`
- Run with **cmd** at MongoDB Server **bin folder**
```bash
    mongod
    mongorestore --gzip --archive=[path to eso.gzip]
```
#### 2) Npm repository setup
- Run with **cmd** at **project folder**
```bash
    npm install
    npm run dev
``` 

#### 3) Open the website 
- Open https://eso.vcap.me:9000 in a browser.

## Preview
https://eso.itake.cz
