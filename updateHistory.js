import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import uuid from "uuid";
import * as getCart from "./getCart";

export async function main(event, context) {
	const getInfo = await getCart.main(event,context);
	const cartInfo = JSON.parse(getInfo.body);

	const	Purchase = {
		purchaseId: uuid.v1(),
		date: Date.now(),
		itens: cartInfo.cart
	};
	const params = {
		TableName: process.env.tableName,
		Key: {
			userId: event.requestContext.identity.cognitoIdentityId
		},
		// 'UpdateExpression' defines the attributes to be updated
		// 'ExpressionAttributeValues' defines the value in the update expression
		UpdateExpression: "SET history = list_append(history,:purchase)",
		ExpressionAttributeValues:{":purchase":[Purchase]},
		// 'ReturnValues' specifies if and how to return the item's attributes,
		// where ALL_NEW returns all attributes of the item after the update; you
		// can inspect 'result' below to see how it works with different settings
		ReturnValues: "ALL_NEW"
	};

	try {
		await dynamoDbLib.call("update", params);
		return success({ status: true });
	} catch (e) {
		return failure({ status: false,error:e });
	}
}