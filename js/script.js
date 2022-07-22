//DEPENDENCIES: helper.js


/**
 * A "component"
 */
class ClusterCard {
    /**
     *
     * @param title String
     * @param feedbackEntries Array
     */
    constructor(title, feedbackEntries) {

    }

    /**
     * @return returns the HTML that can be appended somewhere.
     */
    getHTML(){
        //TODO
    }
}

const DUMMYCLUSTER = ["Once again the app will not download.The app doesn't need a makeover every 96 hrs.Terrible!", 'Trying to book a flight, I prefer United as I have… downloaded it again.Very frustrating.Please help', 'Wont download.', 'Twice now, I cannot even download the app.Ugh!', "The application won't even download onto my phone", "Won't download.Been trying 3 days", 'I have downloaded the app 5 times.Each time I clic…is the only airline app I’ve had this issue with.', "Won't download after multiple attempts", 'Can not download', 'I have downloaded the app 5 times.Each time I clic…is the only airline app I’ve had this issue with.', 'asking for a review already?just downloaded the app!', 'The app is unusable and I always have to re-download the app when it gets like that.', 'Right now, no I would not recommend this app.Unite…ce for watching movies.It refuses to down oad it.', null, "Your app won't download", 'It does not work!I called United and they supposed…till good.I have already paid for all four of us.', 'Website has been easy so far, except for loading t…ed.Attempted 5 different times... different ways.'];
//'http://localhost:1700/api/clusterfeedbacks/56726'

class App {
    constructor(Clock) {
        if(Clock) this.clock = new Clock();
        this.getClusterFeedbacks(56726);
    }

    _startTimer(){
        const timer = this.clock;
        if( timer ) timer.start();
    }

    _endTimer(){
        const timer = this.clock;
        if( timer ) return ( timer.end() );

    }


    /**
     * perform an API query
     * @param endpoint name of the endpoint. e.g. clusters
     * @param params to be passed to fetch
     * @return {Promise<void>}
     */
    async q(endpoint, params){
        this._startTimer();
        if(params === undefined) params = {};
        fetch(`http://localhost:1700/api/${endpoint}`, params)
            .then(res => res.json())
            .then(val => {
                print("script.js 58: ", val);
                print("Timer: ", this._endTimer());
                return val;
            })
    }

    /**
     * get clusters
     * @return {Promise<void>}
     */
    async getClusters() {
        return this.q("clusters");
    }

    /** 56726
     * get clusters
     * @return {Promise<void>}
     */
    async getClusterFeedbacks(clusterID) {
        return this.q(`clusterfeedbacks/${clusterID}`);
    }




}

const app = new App(Clock);
//
// async function connectToAPI(){
//
//
//     fetch('http://localhost:1700/api/clusters')
//         .then(response => response.json())
//         .then(val => {
//             print(val);
//         })
//
// }
//
// connectToAPI();