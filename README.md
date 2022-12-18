# ESO - Enterprise Self-Ordering system for restaurants and gastro
A cross-platform self-ordering system for browsers

## Pre-requisites
- Node.js (v16.18.0)
- MongoDB (4.0.28)

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


## Wildcard certificate

1. Install certbot from 
    - https://certbot.eff.org/lets-encrypt/windows-other
    - https://dl.eff.org/certbot-beta-installer-win32.exe
2. Run CMD with admin privileges
   ```
   certbot certonly --manual --preferred-challenges=dns --email nvbach91@gmail.com --server https://acme-v02.api.letsencrypt.org/directory -d *.itake.cz -d itake.cz
   ```
   - accept all questions
   - deploy DNS TXT records in hosting provider management console.
   - verify TXT records by running nslookup -type=txt _acme-challenge.itake.cz and then continue
3. The certs will be generated at `C:\Certbot\live\itake.cz\`
4. Create a `.pfx` file by running 
   ```
   type fullchain.pem privkey.pem > bundle.pem
   openssl pkcs12 -export -out "certificate_combined.pfx" -inkey "privkey.pem" -in "cert.pem" -certfile bundle.pem
   ```
5. In IIS Manager import the new `certificate_combined.pfx` file
6. Go to your sites and bind the certificate to your port 443 bindings
7. Test it in your browser
8. Next time only run `certbot renew` and repeat step 4-7.
