# bookis

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.




Bookis

Testing Accounts
- local dev
test@test.com : rbdgidqifdyd8989   (Yutao Ming)
test1@test.com : rbdgidqifdyd8989  (Ronald Pang)
test2@test.com : rbdgidqifdyd8989  (Dean Chambers)
test3@test.com : rbdgidqifdyd8989  (Donald Yang)
test4@test.com : rbdgidqifdyd8989  (John William)
test5@test.com : rbdgidqifdyd8989  (Pang YanBin)
- live  -> han_long1989@outlook.com : rbdgidqifdyd8989



Local Setup
- local.env.js needs to be copied into `server/config`
- touch.js should be in ‘client’ directory
- .env file should be in root directory
- MongoDB import

mongoimport -d bookis-dev -c constants --file ./constants

mongorestore -h localhost -p 27017 -d bookis-dev ./bookisDump/bookis-dev


Local Setup
- local.env.js needs to be copied into `server/config`
- touch.js should be in ‘client’ directory
- .env file should be in root directory
- MongoDB import


Spec FAQ
- AWS S3 for storing images
- AWS route53 for domain management and elastic beanstalk for app deploying
- Only thing you will need it to connect with both enviroments on elastic beanstalk, “staging” for staging and “Sample-env” for CMS. If you have credentials for AWS you should be able to figure it out
- Regarding deploy to server - its done thru AWS CLI - elastic beanstalk
- Regarding Prerender, I added required middleware and followed all required steps. You will see, its pretty simple implementation, will send you all required credentials later (https://scotch.io/tutorials/angularjs-seo-with-prerender-io)
- Sendgrid - will send you credentialss later. We use npm module email-templates for generating templates
- Algolia - You will see data model when you log in into algolia dashboard. Also it can be found in our backend code. Will send you all creds later
- We deployed DB on cloud, currently at mLab. Will send you creds. Robomongo is just software which makes browsing/updating/managing mongo data easier. You should download it and connect to you local database and staging database as well, to make things easier for you.
- Regarding bokbasen, we used it to get all books, author and genres from there. In our codebase you will find code which gets all books from bokbasen (1000 per fetch). Once you get all books, authors genres etc, you will need to implement mechanism to sync new book for example once per week (me dont have that mechanism yet)
- Stripe flow is little more complicated. So when user sign up and add book for sale, we need to capture user payout method (in order to payout funds to him when someone buys book from him). For that we use stripe managed account. So whenever user add payout method, we first create managed account for him and then add payout method.
- When user buys book, we need to capture his card data (payment method). For that we use basic stripe contacts. So whenever user buys book, he needs add card, and we create stripe contact and then payment method.

Fetch the books from bokbasen
this one should trigger script for getting all books (1000 per fetch)
node ./pre.script.js --script=./books.updates.js --env=development

navigate into `/server/scripts`and run to get the specific book with a specific ISBN
node ./pre.script.js --script=./bokbasen.book.js --env=development 9788241920356




StagingDB Access
ds135440-a0.mlab.com                :      35440
database : bookis_staging
username : bookis_staging
password : Bookis1337!
Auth Mechanism : SCRAM-SHA-1

Preconditions : (Node version 7.7.2)
1. The address should be added here: http://localhost:3000/my-zone/settings/delivery-details
Storgata
12
2390

2. Adding book for sale via bank account:
    - account name: any
    - account number: NO89370400440532013000

3. Buying with card:
    - Name: any
    - CVC: any
    - exp: any
    - number: 4000005780000007

4. AWS eb cli upgrade regularly





Credentials
Bookis

Loggly
magnus@bookis.no / Bookis1337!
token: f37dadec-4da4-4431-9773-ea7001b567ba
subdomain: bookis

AWS/mLab
magnus@bookis.no / Bookis1337!

AWS access key id : AKIAJTFYHPHUAMBQ3KPQ
security access key : RUEhHIjfl0tdbJ7QpiaYv58EPZWQNEvwo2K5dxJw

Algolia magnus@bookis.no / Bookis1337!

sendGrid bookissendgrid / Bookis1337! 
(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)

FB_LOGIN
bookisno@gmail.com / Bookis1337!
https://console.cloud.google.com/apis/credentials/oauthclient/488179357288-5oc90nfn9jva24fcatg3c4nrefoig203.apps.googleusercontent.com?project=bookiswebapp&authuser=1&organizationId=668585287717&pli=1

process.env.FACEBOOK_ID='251261141963996'; process.env.FACEBOOK_SECRET='b6f312f58ce888eb11acb983e39d36f4'; process.env.DOMAIN='http://ed9dab38.ngrok.io';

GOOGLE_LOGIN
bookisno@gmail.com / Bookis1337!
ID: 488179357288-5oc90nfn9jva24fcatg3c4nrefoig203.apps.googleusercontent.com
sec: mSmhSr-JdeLq0-4qgknDxuWc
API: AIzaSyA-B0gD8c5MYPxyT3ElHwnGxMPvhpRwnNc

Google Analytic tracking id
UA-100769408-1

TWITTER_LOGIN
ID: 4uNwjy7p4L1tqdp5PFPfSAg8p
sec: 3PTn6B47Ds4cVSH0kJYYGO1gjqRH8poKYF31jPy1dhdmGqlwoz

Prerender login 
magnus@bookis.no/Bookis1337!

Zeplin
yutaomin
han_long1989@outlook.com
rbdgidqifdyd8989

Azure portal 
magnus.bookis@outlook.com / Bookis1337!

Stripe 
magnus@bookis.no / Bookis1337!

Bokbasen API documentation
https://bokbasen.jira.com/wiki/display/api/API+Documentation

Bokbasen Interface
https://bokelskere.no/bok

GlobalSign
Username    Bookisglobalsign
Password    Bookis1337!
Alphanumeric number (8 characters) bookis1337
https://gcc.globalsign.com   OR  www.globalsign.com

Godaddy
username: 145827683
PW : Hamster100


FTP
Access to Eldorados book database trough ftp server... Translated from Norwegian:

Hi

We have now published a web-service.
URL: http://services.jm-data.no/multidecII.asmx
Method: HentBeholdningOgPris
Parameters: Username (String), Password (String), ISBN (String)
Response: Semicolon  Line/list (ISBN;Beholdning;Pris + Cr + Lf)

Example of return when search on single  ISBN:
9788282113434;3;269,00

Example of return when search on all ISBN: (ISBN=*):
9788282687645;14;299,00
9788282688758;62;299,00
9788282687386;68;299,00
9788282686105;22;199,00
9788282686112;19;199,00
9788282686129;23;199,00
9788282687614;21;199,00
9788282687621;17;199,00
9788282688079;13;149,00
9788282688574;8;149,00

NB!
Requests on all ISBNs results in large loads on both web server and SQL server.
This should therefore only happen one time per day, between kl. 01:00am and 06:00am

MVH
Ketil Olsen
JM Data System as

Username: bookisftp 
Password: Bookis1337!

 Merchant accounts login credentials:
amw@glassmester1.no
hamster100

eldorada@bookis.no
hamster100


AWS Access IP (Original)
89.164.105.211/32
