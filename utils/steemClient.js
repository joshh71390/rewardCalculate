const dsteem = require('dsteem')

const client = new dsteem.Client('https://api.steemit.com')

const getMedianPrice = async () => {
    const price = await client.database.getCurrentMedianHistoryPrice()
    return price.base.amount / price.quote.amount
}

const getVoterAccount = async (account) => {
    const acc = await client.database.getAccounts([account])

    return acc[0]
}

const  = async () => {
    const props = await client.database.getDynamicGlobalProperties()
    return props
}

module.exports = { getMedianPrice, getVoterAccount, getDynamicGlobalProperties }
