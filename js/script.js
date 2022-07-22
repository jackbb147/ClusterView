//DEPENDENCIES: helper.js


/**
 * A "component"
 */
class ClusterCard {
    /**
     *
     * @param title String
     * @param feedbackEntries Array [ String, String, ... ]
     */
    constructor(title, feedbackEntries) {
        this.html = this.buildHTML(title, feedbackEntries);
    }

    /**
     *               <div class="ClusterCard">
     *                 <div class="container_fluid">
     *                   <div class="row ClusterCard_head">
     *                     <div class="col ClusterCard_title">
     *                       Title of a cluster card.
     *                     </div>
     *                     <div class="ClusterCard_close">X</div>
     *                   </div>
     *
     *                   <div class="row ClusterCard_body hideScrollBar ">
     *                     <div class="container_fluid ClusterCard_body_container hideScrollBar">
     *
     *                       <div class="row ClusterCard_feedback">
     *                         <div class="feedback_entry"> some entry some entry </div>
     *                         <div class="feedback_remove"> - </div>
     *                       </div>
     *
     *                     </div>
     *                   </div>
     *                 </div>
     *               </div>
     */

    /**
     *
     * @param title
     * @return {any}
     */
    buildBody(feedbacks){
        var body = div("row", "ClusterCard_body", "hideScrollBar");
        var body_container = div("container_fluid", "ClusterCard_body_container", "hideScrollBar");

        feedbacks.forEach(feedback => {
            addChild(body_container, this.buildFeedback(feedback));
        })

        addChild(body, body_container);
        return body;
    }

    /**
     *
     * @param content String
     * @return
     */
    buildFeedback(content){
        var feedback = div("row", "ClusterCard_feedback");
        var feedback_entry = div("feedback_entry", "hideScrollBar");
        var feedback_remove = div("feedback_remove");
        feedback_entry.innerHTML = content;
        feedback_remove.innerHTML = "X";
        addChild(feedback, feedback_entry, feedback_remove);
        return feedback;
    }

    buildHead(title){
        var head = div("row", "ClusterCard_head")
        var titleDiv = div("col", "ClusterCard_title");
        var close = div("ClusterCard_close");

        titleDiv.innerHTML = title;
        close.innerHTML = "X";

        addChild(head, titleDiv);
        addChild(head, close);

        return head;
    }

    buildCard(){
        var card = div("ClusterCard");
        return card;
    }

    buildCardContainer(){
        var container  = div("container_fluid");

        return container;
    }

    /**
     * builds the HTML
     * @param title String
     * @param feedbacks Array : [ {content: String} ]
     */
    buildHTML(title, feedbacks){

        var card = this.buildCard();
        var container = this.buildCardContainer();
        var head = this.buildHead(title);
        var body = this.buildBody(feedbacks);
        addChild(container, head, body);
        addChild(card, container);
        return card;
    }

    /**
     * @return returns the HTML that can be appended somewhere.
     */
    getHTML(){
        //TODO
        return this.html;
    }
}

// const DUMMYCLUSTER = ["Once again the app will not download.The app doesn't need a makeover every 96 hrs.Terrible!", 'Trying to book a flight, I prefer United as I have… downloaded it again.Very frustrating.Please help', 'Wont download.', 'Twice now, I cannot even download the app.Ugh!', "The application won't even download onto my phone", "Won't download.Been trying 3 days", 'I have downloaded the app 5 times.Each time I clic…is the only airline app I’ve had this issue with.', "Won't download after multiple attempts", 'Can not download', 'I have downloaded the app 5 times.Each time I clic…is the only airline app I’ve had this issue with.', 'asking for a review already?just downloaded the app!', 'The app is unusable and I always have to re-download the app when it gets like that.', 'Right now, no I would not recommend this app.Unite…ce for watching movies.It refuses to down oad it.', null, "Your app won't download", 'It does not work!I called United and they supposed…till good.I have already paid for all four of us.', 'Website has been easy so far, except for loading t…ed.Attempted 5 different times... different ways.'];
//'http://localhost:1700/api/clusterfeedbacks/56726'

class App {
    constructor(Clock) {
        if(Clock) this.clock = new Clock();
        // print(this.getClusters());
        // print(this.getClusterFeedbacks(56726));
        // this.generateClusterCard(56726);
        // ------------   VARIABLES  ---------
        this._sentenceStore = undefined;    //un-clustered sentences store.


        // ------------     ---------
        var storePromise = this._initiateSentenceStore();

        // ------------     ---------
        var cb = (() => {
            this.fillSection2();
        }).bind(this);

        Promise.all([storePromise]).then( values => {
            cb()
        })

    }

    /**
     * load unclustered sentences(just the id objects) from the API,
     * then initiate its store.
     * check the API documentation for the format of each item.
     * @private
     */
    async _initiateSentenceStore(){
        const _ = this;
        var sentenceIDs = this.loadUnclusteredSentenceIDs();
        return sentenceIDs.then(arr => {
            _._sentenceStore = new Store(arr);
        })
    }

    /**
     * check if sentence store has been loaded.
     * @return {boolean}
     * @private
     */
    _sentenceStoreInitiated(){
        return !(this._sentenceStore === undefined);
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
    async q(endpoint, params={}){
        this._startTimer();
        return fetch(`http://localhost:1700/api/${endpoint}`, params)
            .then(res => res.json())
            .then(val => {
                // print("script.js 58: ", val);
                print("Timer: ", this._endTimer());
                return val;
            })
    }

    /**
     * grabs the ID's of all unclustered sentences , from the API.
     * @return {Promise<Array>}
     */
    async loadUnclusteredSentenceIDs(){
        return this.q("unclusteredsentences");
    }

    /**
     * fill(generate the HTML) of a section(1 or 2)
     * by 1. generating individual items 2. appending
     * each item to the box.
     * @param boxName like ".name". Will be used to append the generated items to.
     *  @param itemsArr array of dom nodes to be appended to box
     *  @return
     */

    /**
     * fill(generate the HTML) of section2 (the unclustered sentences section)
     * @return {Promise<void>}
     */
    async fillSection2(){
        var box = document.querySelector(".unclusteredSentencesWrapper")
        var query = this.q.bind(this);
        var ids = this._sentenceStore.getSome(100);
        var divPromises = [];
        ids.forEach(idObj => {
            let id = idObj.id;
            let divPromise = (new Sentence(query, id)).HTML();
            divPromises.push(divPromise);
        })

        Promise.all(divPromises).then(divs => {
            divs.forEach(div => addChild(box, div));
        })
    }

    async fillSection(boxName, ){

    }

}

/**
 * grabs something from the API
 */
class Component {
    constructor(query, ID) {
        this.q = query;
        this.ID = ID;
    }

}

/**
 * build a cluster, including all its associated feedback entries.
 * from the api.
 */
class Cluster extends Component{
    constructor(query, ID) {
        super(query, ID);
    }

    /** 56726
     * grab the feedback entries of a cluster from the database,
     * then build the HTML component using the grabbed data, then append to the view.
     * @return card
     */
    async generateClusterCard(clusterID) {
        const _ = this;
        /**
         * (2) [Array(1), Array(17)]
         * 0: Array(1)
         * 0: {id: 56726, title: 'Once again the app will not download.', team_id: 427, centroid_sentence_id: 1019785, accepted: 1, …}
         * length: 1
         * [[Prototype]]: Array(0)
         * 1: (17) ["Once again the app will not download.The app doesn't need a makeover every 96 hrs.Terrible!", 'Trying to book a flight, I prefer United as I have… downloaded it again.Very frustrating.Please help', 'Wont download.', 'Twice now, I cannot even download the app.Ugh!', "The application won't even download onto my phone", "Won't download.Been trying 3 days", 'I have downloaded the app 5 times.Each time I clic…is the only airline app I’ve had this issue with.', "Won't download after multiple attempts", 'Can not download', 'I have downloaded the app 5 times.Each time I clic…is the only airline app I’ve had this issue with.', 'asking for a review already?just downloaded the app!', 'The app is unusable and I always have to re-download the app when it gets like that.', 'Right now, no I would not recommend this app.Unite…ce for watching movies.It refuses to down oad it.', null, "Your app won't download", 'It does not work!I called United and they supposed…till good.I have already paid for all four of us.', 'Website has been easy so far, except for loading t…ed.Attempted 5 different times... different ways.']
         * length: 2
         * [[Prototype]]: Array(0)
         */
        const cluster = this.q(`cluster/${clusterID}`);

        const feedbacks = this.q(`clusterfeedbacks/${clusterID}`);
        this.clustersBox = document.querySelector(".clusters-box");
        // print("box: ", this.clustersBox);
        var cb = ( values ) => {
            // print("script.js 191:", values[0][0], values[1]);
            var box = this.clustersBox;
            const  cluster = values[0][0], feedbacks = values[1];
            var card = new ClusterCard(cluster.title, feedbacks)
            addChild(box, card.getHTML());
        }
        Promise.all([cluster, feedbacks] ).then(cb.bind(this));
    }



    /**
     *
     * @param obj
     * @return {Promise<void>}
     */
    async grab(obj){
        // this.grabSentence(idobj.id)
    }

    HTML(){

    }
}

/**
 * grabs a sentence from the API.
 */
class Sentence extends Component{
    constructor(query, ID) {
        super(query, ID);
    }

    /**
     * generate the HTML element for a sentence div
     * to be appended to the body of section_2.
     * @param sentence_text
     */
    generateSentenceDiv(sentence_text){
        var DIV = div("row" ,"unclustered-sentence");
        DIV.innerHTML = sentence_text;

        return DIV;
    }

    /**
     * @param obj see the Cluster API for the format of a sentence object.
     * @return {Promise<void>}
     */
    async grab(){
        // return this.q(`sentence/${obj.id}`).then( val => val[0].sentence_text);
        return this.q(`sentence/${this.ID}`);
    }

    /**
     *
     * @return {Promise<void>}
     */
    HTML(){
        return this.grab().then(val => {
            let text = val[0].sentence_text;
            return this.generateSentenceDiv(text);
        })
    }
}

/**
 * Manages a list of items.
 */
class Store{
    /**
     *
     * @param arr Array
     */
    constructor(arr) {
        this.items = arr;
    }

    add(item){
        (this.items).push(item);
    }

    remove(identifier){
        //TODO
    }

    getAll(){
        return this.items;
    }

    /**
     * get the first n items. n must be <= number of items available.
     * @param n
     */
    getSome(n){
        var ans = [];
        for(var i = 0; i < n; i++) ans.push(this.items[i]);
        return ans;
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