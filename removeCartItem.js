import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import * as getCart from "./getCart";


export async function main(event, context) {
	const getInfo = await getCart.main(event,context);
	const cartInfo = JSON.parse(getInfo.body);

	const data = JSON.parse(event.body);
	const Item = {
		productId: data.productId
	};
	function findId(element) {
		return element.productId == Item.productId;
	}

	try {
			const index = cartInfo.cart.findIndex(findId);

			const params = {
				TableName: process.env.tableName,
				Key: {
					userId: event.requestContext.identity.cognitoIdentityId
				},
				UpdateExpression: "REMOVE cart[" + index + "]"
				//ExpressionAttributeNames: { "#cartItemQuant": "cart[index].quantity" }
			};
			try {
				await dynamoDbLib.call("update", params);
				return success({ status: true });
			} catch (e) {
				return failure({ status: false });
			}

	} catch (e) {
		return failure({ status: false });
	}
}