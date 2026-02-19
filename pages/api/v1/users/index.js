import { createRouter } from "next-connect";
import database from "@/infra/database";
import controller from "@/infra/controllers";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  response.status(200).json();
}
async function postHandler(request, response) {
  response.status(201).json();
}
