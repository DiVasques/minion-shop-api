import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
	// Request body is passed in as a JSON encoded string in 'event.body'
	const data = JSON.parse(event.body);

	const params = {
		TableName: process.env.tableName,
		// 'Item' contains the attributes of the item to be created
		// - 'userId': user identities are federated through the
		//             Cognito Identity Pool, we will use the identity id
		//             as the user id of the authenticated user
		// - 'name': users name
		// - 'email': the registered user email
		// - 'cart': null when creating user
		// - 'history': null when creating user
		Item: {
			userId: event.requestContext.identity.cognitoIdentityId,
			name: data.name,
			email: data.email,
			cart: [],
			history: []
		}
	};

	try {
		await dynamoDbLib.call("put", params);
		return success(params.Item);
	} catch (e) {
		return failure({ status: false });
	}
}