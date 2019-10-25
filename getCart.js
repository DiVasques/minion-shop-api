import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
	const params = {
		TableName: process.env.tableName,
		Key: {
			userId: event.requestContext.identity.cognitoIdentityId
		},
		ProjectionExpression: "cart"
	};

	try {
		const result = await dynamoDbLib.call("get", params);
		if (result.Item) {
			// Return the retrieved item
			return success(result.Item);
		} else {
			return failure({ status: false});
		}
	} catch (e) {
		return failure({ status: false });
	}
}