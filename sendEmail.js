import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
	const data = JSON.parse(event.body);
	const email = data.email;
	const body = data.cart;
	// Load the AWS SDK for Node.js
	var AWS = require('aws-sdk');
	// Set the region

	AWS.config.update({ region: 'us-east-1'});
	// Create sendEmail params
	var params = {
		Destination: { /* required */
			CcAddresses: [
			'goediow@gmail.com',
			'ariel@lawcheck.com.br',
			/* more items */
			],
			ToAddresses: [
				email,
				/* more items */
			]
		},
		Message: { /* required */
			Body: { /* required */
				//Html: {
				//	Charset: "UTF-8",
				//	Data: 'Seus minions foram reservados!!!\n' + JSON.stringify(body, null, 2)
				//},
				Text: {
					Charset: "UTF-8",
					Data: 'Seus minions foram reservados!!!\n\nProdutos:\n' + body
					//JSON.stringify(body, null, 2)
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'MinionShop: Compra Realizada com Sucesso!'
			}
		},
		Source: 'diogovasques@poli.ufrj.br'
	};

	try{
	// Create the promise and SES service object
	await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
	return success({status: true});

	}
	catch (e){
	return failure({ status: false });
	}
	// Handle promise's fulfilled/rejected states
	//sendPromise.then(
	//	function (data) {
	//		console.log(data.MessageId);
	//	}).catch(
	//		function (err) {
	//			console.error(err, err.stack);
	//		});
}