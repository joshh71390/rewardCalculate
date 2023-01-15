// import express JS module into app
// and creates its variable.
var express = require('express')
const cors = require('cors')
var app = express()
const { lookupPost, getSteemProps } = require('./utils/sds.js')
const { getMedianPrice, getVoterAccount } = require('./utils/steemClient.js')

// Creates a server which runs on port 3000 and
// can be accessed through localhost:3000
app.listen(3000, function () {
    console.log('server running on port 3000')
})
app.use(cors({ origin: '*' }))
// Function callName() is executed whenever
// url is of the form localhost:3000/name
app.get('/sbdToPct', sbd_to_percent)

async function sbd_to_percent(req, res) {
    // Use child_process.spawn method from
    // child_process module and assign it
    // to variable spawn

    const price = await getMedianPrice()
    console.log(price)
    const sbd = req.query.steem * price
    console.log(sbd)
    const voterRes = await getVoterAccount(req.query.voter)
    const steemProps = await getSteemProps()
    const sps = steemProps.steem_per_share
    const vp = voterRes.voting_power
    const vests =
        parseFloat(voterRes.vesting_shares.split(' ')[0]) +
        parseFloat(voterRes.received_vesting_shares.split(' ')[0]) -
        parseFloat(voterRes.delegated_vesting_shares.split(' ')[0]) -
        parseFloat(voterRes.vesting_withdraw_rate.split(' ')[0])
    const sp = vests * sps
    const postRes = await lookupPost(req.query.author, req.query.permlink)
    const prs = postRes.net_rshares
    var spawn = require('child_process').spawn

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('py', ['python/sbdToVotePct.py', sbd, prs, sp, vp])

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function (data) {
        res.send(data.toString())
    })
}
