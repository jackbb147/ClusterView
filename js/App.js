'use strict';

// --------------------------------------

class SearchBar extends React.Component {
    /**
     * this.props.cb: callback function for search btn
     * this.props.i: 1 or 2 (identifier used for classname)

     */
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={`searchBar searchBar-${this.props.i}`}>
                <div className={"searchBar_input"}>
                    <input type="text"/>
                </div>
                <div className={"searchBar_btn"} onClick={this.props.cb.bind(this)}>Search</div>
            </div>
        )
    }
}

//TODO some major refactoring needed for section1 and section2 to extend Section.
//TODO each section has a _store variable, _initiateStore() method
class Section extends React.Component {
    /**
     * this.props.i: 1 or 2 (corresponding to section1 and section2)
     * this.props.q: the query() method.
     * @param props
     */
    constructor(props) {
        super(props);
        this._store = undefined;
    }

    /**
     * initiate my store.
     * @return {Promise<void>}
     * @private
     */
    async _initiateStore(){

    }

    /**
     * TODO event handler for undoing the result of onSearch()
     */
    onExitSearch(){

    }

    /**
     * event handler for the search button.
     */
    onSearch(){
        print("App.js 36", this.props.i);
        //TODO print the inputted text
        //TODO print the query function
        //TODO print the load method
        //TODO print the box
        //TODO print the existing cards

    }
}

// ----------- SECTION 1 ----------------

class SectionHead extends React.Component {
    /**
     * this.props.cb: callback function passed to search btn.
     * @param props
     */
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"col-12 section_head"}>
                <div className={"container_fluid"}>
                    <div>{this.props.title}</div>
                    <SearchBar i={this.props.i} cb={this.props.cb}></SearchBar>
                </div>
            </div>
        )
    }
}

class ClustersBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="col col-10 hideScrollBar clusters-box">
                {this.props.children}
            </div>
        )
    }
}

class ClusterCardHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render( ) {
        return (
            <div className={"row ClusterCard_head"}>
                <div className={"col ClusterCard_title"}>{this.props.title}</div>
                <div className={"ClusterCard_close"}>X</div>
            </div>
        )
    }
}

class ClusterCardFeedbackEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    render( ) {
        return (
            <div className={"row ClusterCard_feedback"}>
                <div className={"feedback_entry"}>{this.props.text}</div>
                <div className={"feedback_remove"}>X</div>
            </div>
        )
    }
}

class ClusterCardBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render( ) {
        var i = 0;
        return (
            <div className={"row ClusterCard_body hideScrollBar"}>
                <div className={"container_fluid ClusterCard_body_container hideScrollBar"}>
                    {
                        this.props.feedbacks.map(fb =>
                            <ClusterCardFeedbackEntry key={i++} text={fb}></ClusterCardFeedbackEntry>
                        )
                    }
                </div>
            </div>
        )
    }
}

class ClusterCard extends React.Component {
    /**
     *
     * @param props {title, feedbacks}
     */
    constructor(props) {
        super(props);
    }



    render() {
        let display = this.props.display ? "" : "no-display-until-lg"
        return (
            <div className={`ClusterCard ${display}`}>
                <div className={"container_fluid"}>
                    <ClusterCardHead title={this.props.title}></ClusterCardHead>
                    <ClusterCardBody feedbacks={this.props.feedbacks}></ClusterCardBody>
                </div>
            </div>
        );
    }
}

class ClusterWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"container_fluid clustersWrapper"}>
                <div className="row">
                    <LeftBtn cb={this.props.leftBtnClick}></LeftBtn>
                    <ClustersBox>{this.props.children}</ClustersBox>
                    <RightBtn cb={this.props.rightBtnClick}></RightBtn>
                </div>
            </div>
        )
    }
}

class LeftBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(){
        print("clicked me ");
        this.props.cb();
        var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        var prev = current.previousElementSibling;
        if(prev=== null) return;
        removeClass(prev, "no-display-until-lg");
        addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div onClick={this.handleClick.bind(this)} className={"d-lg-none col col-1 leftBtn"}> {"<"} </div>
        )
    }
}

class RightBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(){
        print("clicked me ");
        this.props.cb();
        var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        var next = current.nextElementSibling;
        if(next === null) return;
        removeClass(next, "no-display-until-lg");
        addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div onClick={this.handleClick.bind(this)} className={"d-lg-none col col-1 rightBtn"}> {">"} </div>
        )
    }
}


class Section1 extends Section {
    constructor(props) {
        super(props);
        // this._clusterStore = undefined;
        this.state = {
            loadedCards: [], //loaded cluster cards,

        }
        this._activeCardIndex = 0;//index of the card currently on display.
    }


    /**
     * grab the feedback entries associated to a cluster.
     * @param clusterID
     * @return
     * @private
     */
    async buildCluster(clusterID){
        const q = this.props.q;
        const cluster = q(`cluster/${clusterID}`);
        const feedbacks = q(`clusterfeedbacks/${clusterID}`);
        return Promise.all([cluster, feedbacks]).then(values => {
            const  cluster = values[0][0], feedbacks = values[1];
            return {
                title: cluster.title,
                feedbacks
            }
        })
    }

    /**
     * GET AN ARRAY OF ALL CLUSTER ID's
     * @return {Promise<*>}
     */
    async _loadClusterIDs(){
        return this.props.q("clusters");
    }

    /**
     * INITIATE A CLUSTER STORE AND RETURN IT
     * @return {Promise<Store>}
     * @private
     */
    async _initiateStore(){
        const _ = this;
        var clusterIDs = this._loadClusterIDs();
        return clusterIDs.then(arr => {
            return new Store(arr);
        })
    }


    /**
     * AFTER MOUNTING, SILENTLY LOAD ALL
     * CLUSTERS, 3 AT A TIME, UNTIL ALL IS LOADED.
     */
    componentDidMount(){
        const _ = this;
        const q = this.props.q;
        print("I(SECTION1) MOUNTED!");
        _._initiateStore()
            .then(store => {
                _._store = store;
                _.loadClusterCards(3)
            })
    }

    /**
     * loads n more cards.
     * @param n
     * @param recurse if true, call itself to get more cards
     * @return {Promise<void>}
     */
    async loadClusterCards(n=5, recurse=false){
        const _ = this;


        //TODO loadedCount may not be up to date! bug for duplicate..
        const bunch = _._store.getSome(n);
        if(bunch.length < 1) return;
        var cardPromises = [];
        bunch.forEach(cluster => {
            cardPromises.push(_.buildCluster(cluster.id));
        })

        //append new cards into existing array of loaded cards.
        Promise.all(cardPromises).then( vals => {
            _.state.loadedCards.push(...vals);
            _.setState({
                loadedCards: _.state.loadedCards
            })
            if(recurse) _.loadClusterCards(n);
        })
    }

    onRightBtnClick(){

        var currentindex = this._activeCardIndex;
        if(currentindex + 1 < this.state.loadedCards.length) this._activeCardIndex++;
        print("App.js 278: ", this._activeCardIndex);
        if((this.state.loadedCards.length - this._activeCardIndex) < 4){
            print("278: loading more cards. ")
            this.loadClusterCards()
        }
    }

    onLeftBtnClick(){

        var currentindex = this._activeCardIndex;
        if(currentindex > 0) this._activeCardIndex -= 1;
        print(this._activeCardIndex)
    }


    render(){
        const _ = this;
        return (
            <div className={"row main_section1"}>
                <SectionHead i={1} cb={this.onSearch} title="All Clusters"></SectionHead>
                <SectionBody>
                    <ClusterWrapper leftBtnClick={this.onLeftBtnClick.bind(this)} rightBtnClick={this.onRightBtnClick.bind(this)}>
                        {this.state.loadedCards.map((cardInfo, i) =>

                            <ClusterCard key={i}
                                         title={cardInfo.title}
                                         feedbacks={cardInfo.feedbacks}
                                         display={i < 1}
                            >
                            </ClusterCard>

                        )}
                    </ClusterWrapper>
                </SectionBody>
            </div>
        )
    }
}




// ----------- SECTION 2 ----------------

class UnclusteredSentence extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"row unclustered-sentence"}>{this.props.text}</div>
        )
    }

}

class SectionBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"col-12 section_body"}>
                {this.props.children}
            </div>
        )
    }
}

class UnclusteredSentencesWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.classname = "unclusteredSentencesWrapper"
    }


    render(){
        const _ = this;
        return (
            <div
                onScroll={this.props.cb.bind(this)}
                 className={"container_fluid unclusteredSentencesWrapper hideScrollBar"}>
                {this.props.children}
            </div>
        )
    }
}

/**
 * The unclustered sentences view
 */
class Section2 extends Section {
    constructor() {
        super();
        this._store = undefined;
        this.state = {
            loadedSentences: [] //loaded sentences
        }
    }

    /**
     *
     * @param clusterID
     * @return
     * @private
     */
    async buildSentence(sentenceID){
        const q = this.props.q;
        const sentence = q(`sentence/${sentenceID}`);

        return sentence.then(val => val[0]);
    }


    /**
     *
     * @param n
     * @param recurse if true, call itself again to load n more.
     * @return {Promise<void>}
     */
    async loadSentences(n=5, recurse=false){
        const _ = this;
        print("383: loadsentences called!")



        const bunch = _._store.getSome(n);
        if(bunch.length < 1) return;
        var promises = [];
        bunch.forEach(obj => {
            promises.push(_.buildSentence(obj.id));
        })

        Promise.all(promises).then( vals => {
            print("350: ", vals);
            _.state.loadedSentences.push(...vals);
            _.setState({
                loadedSentences: _.state.loadedSentences
            })
            if(recurse) _.loadSentences(n);
        })
    }

    /**
     * grabs the ID's of all unclustered sentences , from the API.
     * @return {Promise<Array>}
     */
    async loadUnclusteredSentenceIDs(){
        const q = this.props.q;
        return q("unclusteredsentences");
    }


    /**
     * load unclustered sentences(just the id objects) from the API,
     * then initiate its store.
     * check the API documentation for the format of each item.
     * @private
     */
    async _initiateStore(){
        const _ = this;
        var sentenceIDs = this.loadUnclusteredSentenceIDs();
        return sentenceIDs.then(arr => {
            return new Store(arr);
        })
    }

    componentDidMount(){
        const _ = this;
        const q = this.props.q;
        print("I(SECTION2) MOUNTED!");
        _._initiateStore()
            .then(store => {
                _._store = store;
                print("section 2: ", store.getAll());
                _.loadSentences(10, false);

            })
    }

    handleScroll(){
        //TODO TRIGGER A LOAD SENTENCE()
        const _ = this;
        function f(){
            const classname = "."+this.classname;
            const el = document.querySelector(classname);

            if(el.scrollTop  + el.clientHeight >= 0.8 * el.scrollHeight){
                print("App.js 447: bottom reached!", _.loadSentences);
                _.loadSentences();
            }

        }

        return f
    }


    render(){
        const _ = this;
        return (
            <div className={"row main_section2"}>
                <SectionHead i={2} cb={this.onSearch} title="Unclustered Sentences"></SectionHead>
                <SectionBody>
                    <UnclusteredSentencesWrapper cb={(this.handleScroll)()} loadMore={()=>{_.loadSentences(5,false)}}>
                        {this.state.loadedSentences.map((sentence, index) =>
                            <UnclusteredSentence key={index} text={sentence.sentence_text}></UnclusteredSentence>
                        )}
                    </UnclusteredSentencesWrapper>
                </SectionBody>
            </div>
        )
    }
}




// ----------- APP ------------------------
class App extends React.Component {
    /**
     *
     * @param props {q: query }
     */
    constructor(props) {
        super(props);
    }

    render() {
        return   (
            <div className={"container main"}>
                <Section1 i={1} q={this.props.q}></Section1>
                <Section2 i={2} q={this.props.q}></Section2>
            </div>
        )
    }
}

async function q(endpoint, params={}){
    return fetch(`http://localhost:1700/api/${endpoint}`, params)
        .then(res => res.json())
        .then(val => {
            return val;
        })
}
const domContainer = document.querySelector('.AppContainer');
const root = ReactDOM.createRoot(domContainer);
root.render(<App q={q}></App>);