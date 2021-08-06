const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app/serverTest')

const mongoose = require('mongoose')

chai.should()

chai.use(chaiHttp)

describe('Accounts API', () => {
	describe('GET /searchAccounts', () => {
		it('Searches accounts having name starting with bab', (done) => {
			chai.request(app)
			.get('/accounts/searchAccounts/bab')
			.end((err, res) => {
				console.log(res.body.body.results)
				res.should.have.status(200)
				res.body.body.results.should.be.a('array')
			})
			done()
		})
	})
	after(() => {
		mongoose.disconnect()
		app.close()
	})
})
