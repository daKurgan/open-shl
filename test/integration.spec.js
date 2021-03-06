var ShlConnection   = require("../lib/shl_connection"),
    ShlClient       = require("../lib/shl_client"),
    expect          = require("chai").expect,
    debug           = require("debug")("open-shl:integration-tests");

// Ignored by default since they make real API requests
describe.skip("Shl Client Integration Tests", function () {
    this.timeout(10000);
    var config,
        connection,
        client;

    before(function () {
        config = require("./fixture/config.json");
        connection = new ShlConnection(config);
        client     = new ShlClient(connection); 
    });

    after(function () {
        connection = null;
        client = null;
    });
    
    it("has all the setup data", function () {
        expect(config).to.exist
        expect(config).to.have.property("clientId").with.length.above(0); 
        expect(config).to.have.property("clientSecret").with.length.above(0); 
    });
    
    describe("ShlConnection", function() {
        describe("#connect", function () {
            it("fetches an access token", function (done) {
                connection.connect().then((body) => {
                    expect(connection.accessToken).to.exist;
                    expect(connection.expires).to.be.a("Date")
                })
                .then(done, done);
            });
        });  
    });
    
    describe("ShlClient", function () {
        describe("#seasons", function () {        
            it("fetches all games", function (done) {
                client.season(2015).games()
                    .then((games) => {
                        expect(games).to.be.an("array").and
                            .to.have.length.above(0);
                    })
                    .then(done, done);
            });

            it("fetches a single game", function (done) {
                client.season(2015).game(39642)
                    .then((game) => {
                        expect(game).to.be.an("object");
                    })
                    .then(done, done);
            });

            it("fetches goalkeepers statistics", function (done) {
                client.season(2015).statistics.goalkeepers()
                    .then(stats => {
                        expect(stats).to.be.an("array");
                    })
                    .then(done, done);
            });
            it("fetches players statistics", function (done) {
                client.season(2015).statistics.players()
                    .then(stats => {
                        expect(stats).to.be.an("array");
                    })
                    .then(done, done);
            });
            it("fetches current standings", function (done) {
                client.season(2015).statistics.teams.standings()
                    .then(stats => {
                        expect(stats).to.be.an("array");
                    })
                    .then(done, done);
            });
        });
        
        describe("#teams", function () {
            it("fetches all teams", function (done) {
                client.teams().then(teams => {
                   expect(teams).to.be.an("array").and
                    .to.have.length.above(1); 
                })
                .then(done, done);
            });
            
            it("fetches a single team when teamCode is supplied", function (done) {
                client.teams("FHC").then(team => {
                    expect(team).to.be.an("object").
                        and.to.have.property("facts");
                })
                .then(done, done);
            });
        });
        
        describe("#videos", function () {
            it("fetches all videos", function (done) {
                client.videos().then(videos => {
                    expect(videos).to.be.an("array").and
                        .to.have.length.above(1);
                })
                .then(done, done);      
            });
        });
        
        describe("#articles", function () {
            it("fetches all articles", function (done) {
                client.articles().then(articles => {
                    expect(articles).to.be.an("array").and
                        .to.have.length.above(1);
                })
                .then(done, done);      
            });
        });
    });    
});