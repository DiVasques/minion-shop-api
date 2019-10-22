export function sendEmail(email, body) {
	// Load the AWS SDK for Node.js
	var AWS = require('aws-sdk');
	// Set the region
	AWS.config.update({ region: 'us-east-1' });

	// Create sendEmail params
	var params = {
		Destination: { /* required */
			//    CcAddresses: [
			//    'EMAIL_ADDRESS',
			//     /* more items */
			//    ],
			ToAddresses: [
				email,
				/* more items */
			]
		},
		Message: { /* required */
			Body: { /* required */
				Html: {
					Charset: "UTF-8",
					Data: 'Seus minions foram reservados!!!\n' + JSON.stringify(body, null, 2)
				},
				Text: {
					Charset: "UTF-8",
					Data: JSON.stringify(body, null, 2)
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Compra Realizada com Sucesso!'
			}
		},
		Source: 'diogovasques@poli.ufrj.br'
	};

	// Create the promise and SES service object
	var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

	// Handle promise's fulfilled/rejected states
	sendPromise.then(
		function (data) {
			console.log(data.MessageId);
		}).catch(
			function (err) {
				console.error(err, err.stack);
			});
}