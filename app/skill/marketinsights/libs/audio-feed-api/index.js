const xml = require("xml2js-es6-promise");
const request = require("request-promise");
const Promise = require("bluebird");
const moment = require('moment');

class AudioFeed {
    constructor() {
    }

    getJSONFeed(apiURI, refresh) {
        if(this.feed || refresh) {
            return Promise.resolve(this);
        }

        console.log(apiURI);

        return request({
            uri: apiURI,
		    method: "GET",
            timeout: 5000,
            json: true
        })
        .then(results => {
            console.log('results', results);
            this.feed = results;
            return this;
        }).catch(err => {
            console.log(err)

            this.feed = {"visit_count": "0"};
            return this;
        });
    }

    getUserVistCount(apiURI, data, refresh) {
        if(this.feed || refresh) {
            return Promise.resolve(this);
        }

        console.log(apiURI);

        return request({
            uri: apiURI,
		    method: "POST",
            timeout: 5000,
            body: data,
            json: true
        })
        .then(results => {
            console.log('results', results);
            this.feed = results;
            return this;
        });
    }

    getSubjectList(subject) {
        if(!this.feed) { throw new Error('No feed data available') };

        return this.feed.filter(track => {
            const keywords = (typeof track.keywords === 'string')?track.keywords.split(','):track.keywords;
            return track.keywords.includes(subject);
        });
    }

    getLatest() {
        if(!this.feed) { throw new Error('No feed data available') };

        return this.feed.sort((a, b) => {
            const dateOne = new moment(a.pub_date);
            const dateTwo = new moment(b.pub_date);

            if(dateOne.isBefore(dateTwo)) { return 1; }
            if(dateOne.isAfter(dateTwo)) { return -1; }
            return 0;
        })[0];
    }

    getEpisode(episodeNumber) {
        if(!this.feed) { throw new Error('No feed data available') };

        return this.feed.find(track => {
            return track.episode_num == episodeNumber;
        });
    }

    getSortedAudioUrl() {
        if(!this.feed) { throw new Error('No feed data available') };
         
        return this.feed.sort(function(a,b) {
            console.log("getSorted a : " + a.episode_num);
            console.log("getSorted b : " + b.episode_num);
            return b.episode_num - a.episode_num;
            // var sortedData = b.episode_num - a.episode_num;
            // return this.feed[sortedData - 1].audioURL;
        });
    }

    getVisits() {
        if(!this.feed) { throw new Error('No feed data available') };
         
        return this.feed.visit_count;
    }
}

module.exports = AudioFeed;
