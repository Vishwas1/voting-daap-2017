# E-voting 

> A VAB project
## Table of Contents

<!-- toc -->

- [Overview](#user-content-overview)
- [Problem](#user-content-problem)
- [Solution](#user-content-solution)
- [Technology](#user-content-technology)
- [System Architecture](#user-content-system-architecture)
- [Contract Code](#user-content-contract)
- [Contributing](#contributing)
- [Mobile App](#user-content-mobile-app)
- [Author](#author)

<!-- tocstop -->

## Overview

We have come up with a public voting system where the voting could be transparent, secure and trustable.


## Technology

 So our E-voting  app is devided into five major component. 

 1. Ethereum running on AWS EC2 instance as pvt block.
 2. Nodejs Admin app Deployed over Heroku
 3. Vuejs Based Mobile app which can be installed as Android build
 4. A mongo as a service for database
 5. Adhaar Checksum for Adhaar validation (future use India-Stack)

 When an Admin registers we do following things 


  1. Create an Account on Ethereum server 
  2. When the response has come from geth we input the user in our Mongo Data base
     parameters : {"acountAddr","userAdhaar","Username","passKey"}
  3. Now when Admin has to login he has to enter Adhaar and passkey
  4. When he is logged in he is taken to a pannel where he can create Ballots
  5. The Ballot creation need three parameter in the constructor 
     {"Ballot Name","Start Time","Nominee List"} 
  6. After creating the ballot you can select the ballot and upload the Voter List which is string of Adhaar Id
  
  When user opens the mobile app

   1. He selects the Polls he want to vote for and enters his Adhaar Id
   2. We Check in the Contract if his Adhaar Id exist or not on Ethereum 
   2. if it exist he is taken to the ballot where here does the voting 
 

## System Architecture

![alt text](https://image.prntscr.com/image/wXd085nYTOqQAhsESZdM4w.png "System Architecture")


## Future Architecture Implementation . (Could be more scalable and basic security out of the box from aws) 

![alt text](https://image.prntscr.com/image/qqqB-2yWTzimjR3PVoc8NQ.png "Future Architecture")


## API
 ```
/**
 *  ------------Sample APIS-------------------
 * http://localhost:3000/api/create-ballot
 * http://localhost:3000/api/addparty
 * http://localhost:3000/api/parties-list
 * http://localhost:3000/api/add-voter
 * http://localhost:3000/api/validate-voter
 * http://localhost:3000/api/vote
 * http://localhost:3000/api/vote-count
 * http://localhost:3000/api/validate-adhar
 * http://localhost:3000/api/ballot-list
 * http://localhost:3000/api/admin-create
 * http://localhost:3000/api/admin-login
 * 
 */
```

## Problem

 Everything in this world is available online but even now we have to go to a polling center and wait in a queue for 3–4 hours to cast our vote?
It’s weird. Isn’t it?

Majority thinks its the security .
But what if Blockchain could fundamentally change that?

## Solution
Using Ethereum as block chain we tried to solve this problem. So we have an App where the govt entity can register themselves . 

![alt text](https://image.prntscr.com/image/22vMOGinRs_9i3QuQmRHKg.png "Register A Govt entity for polling")


They get an account and they can create Ballots .

![alt text](https://image.prntscr.com/image/Ss2fNcmjQUGmeBrBfSUt5g.png "Create Ballots")


They can upload Voter List for the ballot.

![alt text](https://image.prntscr.com/image/c2HDAaixTIGbBboWFqQwbA.png "Voter List")


User open's Installs mobile app and use his Adhaar Id for login .

![alt text](https://image.prntscr.com/image/U2ZWTdQKQnCOpNEc6LTUIQ.png "Voter Login Screen")
![alt text](https://image.prntscr.com/image/wHZZP5axRxmYvtFvyvmCoQ.png "Voter Ballot 1")
![alt text](https://image.prntscr.com/image/ivIP-ulvQp6038TrxJUg9w.png "Voter Ballot 2")
![alt text](https://image.prntscr.com/image/-BHGUiR_RqihwXFhZdolQw.png "Voter Ballot 3")



## Contract
  ```
    https://github.com/Vishwas1/voting-daap-2017/blob/master/app/contract/Ballot.sol
  ```
## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Mobile App
 
 ```
  https://github.com/vikramIde/votingapp-mobile
  
  ```


## Author

**E-Voting** © [Vishwas1](https://github.com/Vishwas1), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by vikramIde with help from contributors ([list](Vishwas1/voting-daap-2017/graphs/contributors)).

The Team 

> [vick.Anand](https://facebook.com/vikramabhushan) · GitHub [@rapchik](https://github.com/vikramIde) · 

> [Vishwas.Anand](https://facebook.com/vikramabhushan) · GitHub [@Vishwas1](https://github.com/Vishwas1) · 

> [Harshitha.naidu](https://www.facebook.com/harshitha.naidu61) · GitHub [@harshitha](https://github.com/harshithanaiduk) · 
