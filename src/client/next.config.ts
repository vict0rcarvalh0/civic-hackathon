import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"

const nextConfig = {}

const withCivicAuth = createCivicAuthPlugin({
  clientId: "ad61f608-6a04-4760-b245-0e1290a83131"
})

export default withCivicAuth(nextConfig)
