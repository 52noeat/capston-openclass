const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const url = 'http://localhost:5000/users';
var agent = chai.request.agent(url);
describe('# User test', function () {
    describe('Session Check test', () => {
        it('세션 false', done => {
            chai.request(url)
                .get('/')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal(false)
                    done();
                });
        });
    })

    describe('duplicate test', () => {
        it('아이디 중복', done => {
            chai.request(url)
                .get('/duplicate/testS@email.com')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal(true)
                    done();
                });
        });
        it('새로운 아이디', done => {
            chai.request(url)
                .get('/duplicate/testNew@email.com')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal(false)
                    done();
                });
        });
    })

    // 아이디 삭제 구현 후 활성화
    /*
    describe('Register test', () => {
        it('회원가입 성공', done => {
            chai.request(url)
            .post('/signup')
            .type('form')
            .send({//학생 회원가입
                'name': 'test',
                'StudentId': '200000000002',
                'email': 'testd@test.test',
                'password': 'testest'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body).to.equal(true);
                done();
            })
        });
    });
    */

    describe('Login test', () => {
        it('교수 로그인 return 2', done => {
            chai.request(url)
            .post('/login')
            .type('form')
            .send({//교수 아이디
                'email': 'testP@email.com',
                'password': 'qwe123'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body.Identity).to.equal(2)
                done();
            })
        });
        it('학생 로그인 return 1', done => {
            agent.post('/login')
            .type('form')
            .send({//학생 아이디
                'email': 'testS@email.com',
                'password': 'qwe123'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body.Identity).to.equal(1)
                done();
            })
        });
        it('세션 true', done => {
            agent.get('/')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.equal(true)
                done();
            });
        });
        it('로그아웃 성공', done => {
            agent.get('/logout')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.text).to.equal("logout")
                done();
            });
        });
    });

});
