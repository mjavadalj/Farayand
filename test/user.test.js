const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server/app');
const dataForTests = require('./data')

describe('---------------------   Sign Up ----------------------------', () => {
    it('correct sign up', (done) => {
        request(app)
            .post('/api/user/signup')
            .send(dataForTests.correctSignUpRequest)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
    // ? ------------------------ add this later
    // it('fail sign up', (done) => {
    // 	request(app)
    // 		.post('/api/user/signup')
    // 		.send(dataForTests.failSignUpRequest)
    // 		.end((err, res) => {
    // 			expect(res.statusCode).to.equal(422);
    // 			done();
    // 		});
    // });
    // it('not valid sign up', (done) => {
    // 	request(app)
    // 		.post('/api/user/signup')
    // 		.send(dataForTests.notValidSignUpRequest)
    // 		.end((err, res) => {
    // 			expect(res.statusCode).to.equal(422);
    // 			done();
    // 		});
    // });

    // it('sign up failed situations', (done) => {
    // 	request(app)
    // 		.post('/api/user/signup')
    // 		.send(dataForTests.correctSignUpRequest)
    // 		.end((err, res) => {
    // 			expect(res.message).to.not.equal('sign up failed');
    // 			done();
    // 		});
    // });
});
