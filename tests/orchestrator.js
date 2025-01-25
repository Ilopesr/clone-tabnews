import retry from "async-retry";

async function waitingForAllServices() {
  await webForWebServer();

  async function webForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

export default {
  waitingForAllServices,
};
