import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import * as getCart from "./getCart";

export async function main(event, context) {
	const cartInfo = await getCart.main(event,context);
	const data = JSON.parse(event.body);
	const Item = {
		productId: data.productId,
		quantity: data.quantity
	};
	function findId(element) {
		return element.productId == Item.productId;
	}

	try {
			const index = cartInfo.bodyJson.cart.findIndex(findId);

			if (index == -1) {

				const params = {
					TableName: process.env.tableName,
					Key: {
						userId: event.requestContext.identity.cognitoIdentityId
					},
					// 'UpdateExpression' defines the attributes to be updated
					// 'ExpressionAttributeValues' defines the value in the update expression
					UpdateExpression: "SET cart = list_append(cart,:item)",
					ExpressionAttributeValues: { ":item": [Item] },
					// 'ReturnValues' specifies if and how to return the item's attributes,
					// where ALL_NEW returns all attributes of the item after the update; you
					// can inspect 'result' below to see how it works with different settings
					ReturnValues: "ALL_NEW"
				};
				try {
					await dynamoDbLib.call("update", params);
					return success({ status: true });
				} catch (e) {
					return failure({ status: false, error1: e });
				}
			}
			else {
				const UpdatedItem = {
					productId: data.productId,
					quantity: data.quantity + cartInfo.bodyJson.cart[index].quantity
				};
				const params = {
					TableName: process.env.tableName,
					Key: {
						userId: event.requestContext.identity.cognitoIdentityId
					},
					UpdateExpression: "SET cart["+ index +"] = :updatedItem",
					ExpressionAttributeValues: {
						":updatedItem":UpdatedItem
					}
					//ExpressionAttributeNames: { "#cartItemQuant": "cart[index].quantity" }
				};
				try {
					await dynamoDbLib.call("update", params);
					return success({ status: true });
				} catch (e) {
					return failure({ status: false, error12: e,idnes:index });
				}
			}
	} catch (e) {
		return failure({ status: false });
	}
}