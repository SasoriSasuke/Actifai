'use strict';

const express = require('express');
const seeder = require('./seed');
const postgres = require('./api/postgres');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

async function start() {
  // Seed the database
  await seeder.seedDatabase();

  // App
  const app = express();

  // Health check
  app.get('/health', (req, res) => {
    res.send('Hello World');
  });

  // Write your endpoints here
  app.post('/user_info/:userId', function (req, res) {
	   res.type('application/json');
	   let userId = parseInt(req.params.userId);
	   
	   if(Number.isSafeInteger(userId)) {
		   postgres.getUserInfo(userId).then(function(userInfoResult){
			   res.end(userInfoResult);
		   });
	   }
	   else {
		   res.status(500).json({error: 'userId is invalid'})
	   }
  })
  
  app.post('/user_sales/:userId', function (req, res) {
	   res.type('application/json');
	   let userId = parseInt(req.params.userId);
	   
	   if(Number.isSafeInteger(userId)) {
		   postgres.getUserSales(userId).then(function(userSalesResult){
			   res.end(userSalesResult);
		   });
	   }
	   else {
		   res.status(500).json({error: 'userId is invalid'})
	   }
  })

  app.listen(PORT, HOST);
  console.log(`Server is running on http://${HOST}:${PORT}`);
}

start();
