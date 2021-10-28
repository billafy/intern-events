const {Account, Message} = require('../schema/models')
const {getAccountId} = require('../utils/auth')
const {Types: {ObjectId}} = require('mongoose')

const socketIds = {}

const addSocketId = (socketId, accountId) => {
	if(!socketIds[accountId]) 
		socketIds[accountId] = []
	socketIds[accountId].push(socketId)
}

const socketConnection = async (socket) => {
	const accessToken = socket.handshake.headers.cookie.split('=')[1]
	const accountId = await getAccountId(accessToken);
	addSocketId(socket.id, accountId);
	socket.on('message', async ({from, to, text}) => {
		if(!from || !to || !text || accountId !== from) 
			return;
		const exists = await Account.exists({_id: ObjectId(to)})
		if(!exists) 
			return;
		if(socketIds[to]) {
			console.log('emi')
		}
		else {
			console.log('User not online')
		}
	})
}

module.exports = socketConnection