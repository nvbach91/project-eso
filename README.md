# ESO - Enterprise Self-Ordering system for restaurants and gastro
A cross-platform self-ordering system for browsers

## Technologies
- Node.js (v16.18.0)
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
    npm install / yarn
    npm run dev / yarn dev
``` 

#### 3) Open the website 
- Open https://eso.vcap.me:9000 in a browser (The hosts file `C:\Windows\System32\drivers\etc\hosts` must include line `127.0.0.1 eso.vcap.me`)

## Preview
https://eso.itake.cz
