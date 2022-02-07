'use strict';

const { Client } = require('pg');

const pgclient = new Client({
  host: 'db',
  port: '5432',
  user: 'user',
  password: 'pass',
  database: 'actifai'
});

pgclient.connect();

async function getUserInfo(userId) {
	let getUserInfoQuery = `
	    SELECT users.name AS user_name, users.role AS user_role, groups.name AS group_name
		FROM public.users AS users 
		INNER JOIN public.user_groups AS user_groups ON users.id = user_groups.user_id
		INNER JOIN public.groups AS groups ON groups.id = user_groups.group_id
		WHERE users.id = ` + userId + `;`;
	
	let userInfoResult = await pgclient.query(getUserInfoQuery);
	
	let userName, userRole;
	let userGroupSet = new Set();
	
	for(var i = 0; i < userInfoResult.rows.length; i++) {
		userName = userInfoResult.rows[i].user_name;
		userRole = userInfoResult.rows[i].user_role;
		userGroupSet.add(userInfoResult.rows[i].group_name);
	}
	
	let response = {name:userName, role:userRole, group:Array.from(userGroupSet)};
	
	return JSON.stringify(response);
}

async function getUserSales(userId) {
	let getUserSalesQuery = `
	    SELECT SUM(amount) AS sales, date
		FROM public.sales
		WHERE user_id = ` + userId + `
		GROUP BY date
		ORDER BY date ASC;`;
	
	let userSalesResult = await pgclient.query(getUserSalesQuery);
	
	let responseArray = new Array(userSalesResult.rows.length);
	
	for(var i = 0; i < userSalesResult.rows.length; i++) {
		let response = {sales:userSalesResult.rows[i].sales, date:userSalesResult.rows[i].date};
		responseArray[i] = response;
	}
	
	return JSON.stringify(responseArray);
}

module.exports = {
	getUserInfo,
	getUserSales
}
