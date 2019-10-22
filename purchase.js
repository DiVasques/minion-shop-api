import { success, failure } from "./libs/response-lib";
import * as dumpCart from "./dumpCart";
import * as updateHistory from "./updateHistory";
import * as getCart from "./getCart";
import * as getEmail from "./getEmail";
import * as sendEmail from "./sendEmail";

export async function main(event, context) {

	try {
		const cartInfo = await getCart.main(event,context);

		const emailInfo = await getEmail.main(event,context);

		await updateHistory.main(event, context);

		await dumpCart.main(event, context);

		sendEmail.sendEmail(emailInfo.bodyJson.email,cartInfo.bodyJson.cart);

		return success({status: true});
	} catch (e) {
		return failure({ status: false , error: e});
	}
}