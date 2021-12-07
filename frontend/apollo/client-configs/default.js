export default function (context) {
  return {
    httpEndpoint: context.$config.backendHttp,
    wsEndpoint: context.$config.backendWs,
    websocketsOnly: true,
  }
}
