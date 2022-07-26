'use strict';


// ==================== CONSTANTS ====================
const searchBarClassName = "searchBar"; //TODO: refactor this in section class itself
// --------------------------------------
const clustersBoxClassName = "clusters-box";    //TODO  refactoring
const sentencesBoxClassName = "unclusteredSentencesWrapper"; //TODO refactoring
const clusterEndpoint = "clusters";
const clusterFeedbacksEndpoint = "clusterfeedbacks";
const unclusteredSentencesEndpoint = "unclusteredsentences";
const sentenceEndpoint = "sentence";
const sentenceClassName = "unclustered-sentence";

const acceptedClassName = "accepted";
const unacceptedClassName = "unaccepted";
const sectionEndpoints = [
    [clusterEndpoint, clusterFeedbacksEndpoint],
    [unclusteredSentencesEndpoint, sentenceEndpoint]
];
const INITIALLOADCOUNT_SENTENCE = 20;
const INITIALLOADCOUNT_CLUSTER = 3;

// ----------- SECTION LOGIC ------------------------

class Section extends React.Component {
    /**
     * this.props.i: 1 or 2 (corresponding to section1 and section2)
     * this.props.q: the query() method.
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            displayTemp: false, // if true, display temporary items.
            managers:[new SectionItemManager()],
            _managerIndex: 0 //which manager to use.
        }
        this._boxClassName = undefined;
        this._itemClassName = undefined;
        this._title = undefined;
        this._endpoint = undefined; //e.g. "api/endpoint"
        this._gettingSome = false;
        this._filter = 0;


    }

    /**
     *
     * @return {Promise<Awaited<*>[]>}
     */
    async componentDidMount(){
        const _ = this;
        let manager = new SectionItemManager(
            _.props.q,
            sectionEndpoints[_.props.i - 1],
        );
        _.setState({
            itemManagers: [manager]
        })
        return manager.initiate()
            .then( () => {



                //after initiating, call setState to trigger a re-render.
                _.setState({
                    itemManagers: [manager]
                })
            })

    }



    get items(){
        return this.manager
            ? this.manager.getAllItems()
            : [];
    }

    get filter(){
        return this._filter;
    }

    /**
     * set filter!
     * @param newFiler
     */
    set filter(newFiler){

        if(newFiler > 2 ) newFiler = 0;
        this._filter = newFiler;
    }


    get whichManager(){
        return this.state._managerIndex;
    }

    set whichManager(newIndex){
        if(newIndex > this.managers.length || newIndex < 0) return;
        this.setState({_managerIndex: newIndex})
    }

    //TODO
    get manager(){
        return this.state.managers[this.whichManager];
    }

    set manager(newManager){
        let managers = this.managers;
        managers[this.whichManager] = newManager;
        this.managers = managers;
    }

    get managers(){
        print2("120: ", this.state);
        return this.state.managers;
    }
    set managers(newManagers){
        this.setState({managers: newManagers})
    }

    /**
     * returns a callback function that can be passed down
     * to a component that needs lazy-loading.
     * @return {f}
     * @private
     */
    _handleScroll(){
        //TODO TRIGGER A LOAD ITEM ()
        const _ = this;

        function f(){
            const classname = "."+this.classname;
            const el = document.querySelector(classname);

            if(el.scrollTop  + el.clientHeight >= 0.8 * el.scrollHeight){
                print("App.js 123: bottom reached!");
                _.manager.activeIndex+=1;
                _.manager = _.manager; //THIS SETTER WILL TRIGGER A RERENDER.
            }

        }

        return f
    }

    /**
     * generate a new manager, and append it
     * to this.managers[]
     * @return a new manager object.
     */
    getNewManager(q, endpoints, filter=0){

    }


    /**
     * TODO event handler for undoing the result of onSearch()
     */
    onClear(){
        P("YOU CLEARED!");
        let managers = this.managers
        print2("managers: ", managers);
        managers.pop();
        this.managers = managers;
        this.whichManager--;
    }

    /**
     * event handler for the search button.
     */
    async onSearch(){

        const _ = this;
        //TODO print the inputted text
        var field = document.querySelector(`.${searchBarClassName}-${this.props.i} > .${searchBarClassName}_input > input`);
        let input = field.value;
        P("YOU SEARCHED!" + field.value);
        //TODO get a NEW MANAGER, append it to managers[], and switch to that one
        let unfilteredEndpoints = sectionEndpoints[_.props.i -1];
        let endpoint0 = unfilteredEndpoints[0] + "/" + input,
            endpoint1 = unfilteredEndpoints[1];
        let manager = _.getNewManager(
            _.props.q,
            [endpoint0, endpoint1]
        );
        print2("manager: ", manager);
        let managers = _.managers;

        return manager.initiate()
            .then(() => {
                // print2("189: managers: ", managers);
                P("196: initated: ", manager);
                managers.push(manager);
                _.managers = managers;
                _.whichManager = _.managers.length-1;
                print2("new manager: ", manager);

                //TODO: load, with custom endpoint and filter
            })

        //


        // // clear out the temp items array, before loading it.
        // this.setState({
        //     tempItems: []
        // });
        // print("App.js 36", this , this.props.i);

        // //TODO print the query function
        // print("app.js 71: ", this.props.q);
        // //TODO do a query, but use the inputted text as a filter.
        // var prom = this._initiateStore(field.value);
        // prom.then(store => {
        //     print("app.js 113: ", store);
        //
        //     //TODO print the load method
        //     print("app.js 86: ", this._loadItems);
        //     //TODO load the fetched items to some array.
        //     this._loadItems(-1,
        //         false,
        //         store,
        //         this.state.tempItems)
        //         .then(val => {
        //             this.setState(this.state);
        //             //TODO print the box
        //             print("app.js 158: ", this._boxClassName );
        //
        //             //TODO print the loaded temporary items.
        //             print("app.js 160: ", this.state.tempItems);
        //             //TODO hide current items
        //             this._displayTempItems();
        //             //TODO load the temporary items into view.
        //
        //         })
        // })
    }

}

/**
 *
 */
class Section1 extends Section {
    /**
     * cards are built from this.state.loadedItems,
     * where each item is an object associated with a cluster.
     * @param props
     */
    constructor(props) {
        super(props);

        this._boxClassName = clustersBoxClassName;
        this._endpoint = clusterEndpoint;
        this._filter = 0;    // 0 for display all, 1 for accepted only, 2 for unaccepted only
    }

    /**
     *
     * @return {Promise<Awaited<*>[]>}
     */
    async componentDidMount(){
        const _ = this;
        let manager = new ClustersManager(
            _.props.q,
            sectionEndpoints[_.props.i - 1],
        );
        _.managers = [manager];
        return manager.initiate(INITIALLOADCOUNT_CLUSTER)
            .then( () => {
                //after initiating, call setState to trigger a re-render.
                _.managers = [manager];
            })
    }

    //
    // /**
    //  * AFTER MOUNTING, SILENTLY LOAD ALL
    //  * CLUSTERS, 3 AT A TIME, UNTIL ALL IS LOADED.
    //  */
    // componentDidMount(){        // const _ = this;
    //     // const q = this.props.q;
    //     // print("I(SECTION1) MOUNTED!");
    //
    // }


    /**
     * generate a new manager,
     * @return a new manager object.
     */
    getNewManager(q, endpoints, filter=0){
    //TODO
        let manager = new ClustersManager(q, endpoints, filter);
        return manager;
    }




    get title(){
        switch (this.filter){
            case 0:
                return "All Clusters";
            case 1:
                return "Accepted Clusters";
            case 2:
                return "Unaccepted Clusters";
        }
    }
    /**
     * toggles the filter between the three modes.
     * @private
     */
    _filterDisplay(){


        this.filter++;
        print("594: filter after: ", this.filter);
        this.manager.filter = this.filter;
        this.manager = this.manager;

        //TODO
    }

    /**
     *
     * @param direction 1 for right, -1 for left
     * @return {f}
     */

    onRightClick(){
        const _ = this;
        const manager = _.manager;
        function f(){
            print2("f called ");
            let oldindex = manager.activeIndex;
            manager.activeIndex++;
            print2(manager.activeIndex, oldindex, manager.activeIndex == oldindex)
            if((manager.activeIndex) == oldindex){
                print2("no change in index! ");
            }
            _.manager = manager;    //set state, to trigger re-render
        }

        return f;
    }

    onLeftClick(){
        const _ = this;

        function f(){
            let manager = _.manager;
            manager.activeIndex -= 1;
            // manager.decrementIndex();
            _.manager = manager;
        }

        return f;
    }

    /**
     * TODO Some major refactoring can be done on the toggler function.
     * the call back function for accept/unaccept btn.
     * sends an API
     * @return function
     */
    _toggleAcceptedStatus(){
        //TODO

        const _ = this;
        const q = _.props.q;

        /**
         *
         * @param accepted
         * @param id cluster id.
         * @param index the index of this cluster, in the currently displayed items array.
         */
        function toggler(accepted, id, index=undefined){

            console.trace()
            print2(this);
            _.manager.update(index, accepted ? "unacceptcluster" : "acceptcluster")
                .then(newManager => {
                    print2(newManager);
                    _.manager = newManager
                })
            //
            // //TODO send request to API
            // let queryString = accepted ? "unacceptcluster/" : "acceptcluster/";
            // queryString += id;
            // var changeStatusPromise = q(queryString);
            // changeStatusPromise.then(val => {
            //     //TODO  trigger a reload
            //     //  TODO 1. fetching  this cluster again
            //     var clusterPromise = _._buildItem(id);
            //     clusterPromise.then(cluster => {
            //         print("637: updated cluster: ", cluster)
            //         //TODO 2. swap this with the old one in the current items array.
            //         let items = _.state.displayTemp ? _.state.tempItems : _.state.loadedItems;
            //         items[index] = cluster;
            //         //TODO 2 then setstate to trigger a rerendering.
            //         if(_.state.displayTemp) {
            //             _.setState({
            //                 tempItems: items
            //             })
            //         }else{
            //             _.setState({
            //                 loadedItems: items
            //             })
            //         }
            //     })
            //
            //
            // })
            //
            //

        }

        return toggler;
    }

    /**
     * for removing a feedback entry from a cluster card.
     */
    onRemoveFeedback(){
        const   _ = this,
                q = _.props.q,
                manager = _.manager;

        function f(clusterID, sentenceID, cardIndex){
            print2("357: remove feedback called with: ", clusterID, sentenceID, cardIndex);
            _.manager.update(cardIndex,
                "removesentence",
                clusterID,
                sentenceID
            )
                .then (newManager => {
                    _.manager = newManager;
                    _.props.cb(sentenceID);
                })
            // //send a remove query to the API
            // var v = true;
            // if(clusterID != -666 && v){
            //     q(`removesentence/${clusterID}/${sentenceID}`)
            //         .then (val => {
            //             _._buildItem(clusterID).then(cluster => {
            //                 //TODO
            //                 let index = cardIndex;
            //                 print("637: updated cluster: ", cluster)
            //                 //TODO 2. swap this with the old one in the current items array.
            //                 let items = _.state.displayTemp ? _.state.tempItems : _.state.loadedItems;
            //                 items[index] = cluster;
            //                 //TODO 2 then setstate to trigger a rerendering.
            //                 if(_.state.displayTemp) {
            //                     _.setState({
            //                         tempItems: items
            //                     })
            //                 }else{
            //                     _.setState({
            //                         loadedItems: items
            //                     })
            //                 }
            //
            //
            //             })
            //         })
            // }
            // // on resolve, set state
        }

        return f;
    }

    render(){
        // print("804: new filter value: ", this.state.filter);
        const _ = this;
        // var items = this.state.displayTemp ?
        //     this.state.tempItems :
        //     this.state.loadedItems;
        // var items = this.state.itemManager[]
        // var filter = {
        //     displayAll: _.state.filter === 0,
        //     displayAccepted: !(_.state.filter === 2)
        // }
        // var title = filter.displayAll
        //     ? "All Cluster"
        //     : filter.displayAccepted
        //         ? "Accepted Clusters"
        //         : "Unaccepted Clusters";
        // items =  items.filter(child => {
        //     return (filter.displayAll ||
        //         (filter.displayAccepted && child.accepted) ||
        //         (!filter.displayAccepted && !child.accepted))
        // });
        // //load more, if items is 0
        let filter = _.filter
        let items = _.items;
        let manager = _.manager;
        let activeIndex = manager ? manager.activeIndex : -1;

        return (

            <div className={"row main_section1"}>
                <SectionHead
                    filterCB={this._filterDisplay.bind(this)}
                    cb={this.onSearch.bind(this)}   //search
                    cbClear={this.onClear.bind(this)}   //clear search
                    i={1}
                    title={this.title}
                    picking={this.props.picking}
                >
                </SectionHead>

                <SectionBody>
                    <ClusterWrapper
                        rightBtnClick={_.onRightClick()}
                        leftBtnClick={_.onLeftClick()}
                        scrollcb={_._handleScroll()}
                    >
                    {items.map((cardInfo, index) => {
                            let {accepted, title, feedbacks, id} = cardInfo,
                                key = index,
                                display = index === activeIndex;
                            return <ClusterCard
                                                key={key}
                                                id={id}
                                                title={title}
                                                accepted={accepted}
                                                feedbacks={feedbacks}
                                                display={display}
                                                index={index}
                                                headCB={this._toggleAcceptedStatus()}
                                                removeCB={this.onRemoveFeedback()}
                                                giveMe={this.props.giveMe}
                                                picking={this.props.picking}
                            />
                    })}
                    </ClusterWrapper>
                </SectionBody>
                {/*<SectionBody>*/}
                {/*    <ClusterWrapper*/}
                {/*        scrollcb={_._handleScroll()}*/}
                {/*        leftBtnClick={this.onLeftBtnClick.bind(this)}*/}
                {/*        rightBtnClick={this.onRightBtnClick.bind(this)}*/}
                {/*        filter={filter}>*/}
                {/*        {items.map((cardInfo, index) => {*/}
                {/*                let accepted = cardInfo.accepted;*/}
                {/*                return <ClusterCard key={index}*/}
                {/*                                    title={cardInfo.title}*/}
                {/*                                    accepted={accepted}*/}

                {/*                                    feedbacks={cardInfo.feedbacks}*/}
                {/*                                    */}
                {/*                                    headCB={this._toggleAcceptedStatus()} //the callback function for (un)acceptBtn*/}
                {/*                                    id={cardInfo.id}*/}
                {/*                                    index={index}*/}
                {/*                                    removeCB={this.onRemoveFeedback()} //remove a feedback entry*/}
                {/*                >*/}
                {/*                </ClusterCard>*/}
                {/*            }*/}

                {/*        )}*/}
                {/*    </ClusterWrapper>*/}
                {/*</SectionBody>*/}
            </div>
        )
    }
}

/**
 * The unclustered sentences View
 */
class Section2 extends Section {
    constructor(props) {
        print("492 Section2 Constructor called: ");
        super(props);
        this._boxClassName = sentencesBoxClassName;
        this._endpoint = unclusteredSentencesEndpoint;
        this._itemClassName = sentenceClassName;

    }
    /**
     *
     * @return {Promise<Awaited<*>[]>}
     */
    async componentDidMount(){
        const _ = this;
        let manager = new SentencesManager(
            _.props.q,
            sectionEndpoints[_.props.i - 1],
        );
        return manager.initiate(INITIALLOADCOUNT_SENTENCE)
            .then( () => {
                manager.activeIndex = manager.count()-1;
                //after initiating, call setState to trigger a re-render.
                _.managers = [manager];
            })
    }


    /**
     * generate a new manager,
     * @return a new manager object.
     */
    getNewManager(q, endpoints, filter=0){
    //TODO
        let manager = new SentencesManager(q, endpoints, filter)
        return manager;
    }



    //TODO active index should always be at the end,
    // SO that when triggering a loadMore, ...

    async processRemovedSentences(){
        const _ = this;
        if(!_.props.removedSentences.isEmpty()){
            // pop and load.
            let ids = _.props.removedSentences.getItems();
            let promises = ids.map( id =>
                //TODO
                _.manager.fetchOneID(id)
                    .then(newManager => {
                        print2(newManager.idstore.last);
                        print2(newManager.idstore);
                    })
            )
            return Promise.all(promises);
        }

    }


    render(){
        const _ = this;
        if(!_.props.removedSentences.isEmpty())
        {
            _.processRemovedSentences().then( val => {
                P("555!");
                _.props.cb();
            })
        }
        let items = this.items;
        print2("items: ", items);
        return (
            <div className={"row main_section2"}>
                <SectionHead
                    i={2}
                    cb={this.onSearch.bind(this)}
                    cbClear={this.onClear.bind(this)}
                    title="Unclustered Sentences"
                />

                <SectionBody>
                    <UnclusteredSentencesWrapper cb={(_._handleScroll)()}>
                    {items.map((sentence, index) =>
                        <UnclusteredSentence
                            key={index}
                            text={sentence.sentence_text}
                            pickMe={_.props.pickMe}
                            sentence_id={sentence.id}
                        />
                    )}
                    </UnclusteredSentencesWrapper>
                </SectionBody>
                {/*<SectionBody>*/}
                {/*    <UnclusteredSentencesWrapper cb={(this._handleScroll)()} loadMore={()=>{_._loadItems(5,false)}}>*/}
                {/*        {items.map((sentence, index) =>*/}
                {/*            <UnclusteredSentence key={index} text={sentence.sentence_text}></UnclusteredSentence>*/}
                {/*        )}*/}
                {/*    </UnclusteredSentencesWrapper>*/}
                {/*</SectionBody>*/}
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
        this.state = {
            _removedSentences : new Store(),

            // if empty, the user didn't select any sentences to be dropped in to cluster.
            pickedSentences: new Store()
        }
    }

    /**
     * is the user picking a sentence(to add to a cluster? )
     * @return {boolean}
     */
    get picking() {
        return !(this.state.pickedSentences.isEmpty())
    }

    get pickedSentences(){
        return this.state.pickedSentences
    }

    set pickedSentences(obj){
        this.setState({pickedSentences: obj})
    }

    get removedSentences(){
        return this.state._removedSentences;
    }

    set removedSentences(newObj){
        this.setState({
            _removedSentences: newObj
        })
    }

    /**
     *
     * Callback function passed down to cluster cards (section1)
     * for the adding-sentence-to-cluster feature.
     */
    _handleClusterClick(clusterID){
        print("989: handleClusterClick called: ", clusterID);
    }

    /**
     * Callback function passed down to sentences (section2)
     * for the adding-sentence-to-cluster feature.
     */
    _handleSentenceClick(sentenceID){
        print("997: handleSentenceClick called: ", sentenceID)
    }

    /**
     * on removing a sentence, the removed ID should
     * be reported to App class, so that
     * section 2 can trigger a new fetch for the
     * newly unclustered sentence.
     * @private
     */
    _handleSentenceRemove1(){
        const _ = this;

        function f(removedSentenceID){
            P("602: F CALLED, with ", removedSentenceID);
            _.removedSentences.append([removedSentenceID]);
            print2("removed sentences: ", _.removedSentences);
            _.removedSentences = _.removedSentences; //to trigger a re-render.
        }

        return f;
    }

    _handleSentenceRemove2(){
        const _ = this;
        function f(){
            P("======= =====648 f called! HANDLING REMOVE ");
            _.removedSentences.clear();
            _.removedSentences = _.removedSentences; // to trigger a rerender.
        }

        return f;
    }

    _handleGiveToCluster(){

        const _ = this;
        function f(clusterID){
            P("CLICKED, 752", clusterID, _.pickedSentences);
            let pickedSentenceIDs = _.pickedSentences.getItems()
            while(!_.pickedSentences.isEmpty())
            {
                let id = pickedSentenceIDs.pop();
                print2("ID: ", id);
            }
        }

        return f;
    }

    _handlePickSentence(){

        const _ = this;
        function f(sentenceID){
            P("CLICKED, 756", sentenceID);
            let sentences = _.pickedSentences
            sentences.append([sentenceID]);
            _.pickedSentences = sentences;
        }

        return f;

    }

    render() {
        return   (
            <div className={"container main"}>
                <Section1 i={1} q={this.props.q}
                          cb={this._handleSentenceRemove1()}
                          giveMe={this._handleGiveToCluster()}
                          picking={this.picking}
                />
                <Section2 i={2}
                          q={this.props.q}
                          cb={this._handleSentenceRemove2()}
                          removedSentences={this.removedSentences}
                          pickMe={this._handlePickSentence()}
                />
            </div>
        )
    }
}

const PRODUCTION = false;
async function q(endpoint, params={}){
    var link = PRODUCTION ? "https://clusterjack.herokuapp.com/api" : "http://localhost:1700/api";
    return fetch(`${link}/${endpoint}`, params)
        .then(res => res.json())
        .then(val => {
            return val;
        })
}
const domContainer = document.querySelector('.AppContainer');
const root = ReactDOM.createRoot(domContainer);
root.render(<App q={q}></App>);

// ==================== VIEW COMPONENTS ====================
class SearchBar extends React.Component {
    /**
     * this.props.cb: callback function for search btn
     * this.props.i: 1 or 2 (identifier used for classname)

     */
    constructor(props) {
        super(props);
    }

    /**
     * after pressing search, the clear button appears.
     * After clearing, the clear button disappears.
     * @private
     */
    _onSearch(){
        //TODO
        var clearBtn = document.querySelector(`.searchBar-${this.props.i} >.searchBar_clear`)
        if(clearBtn.classList.contains("no-display")){
            clearBtn.classList.remove("no-display");
        }
        this.props.cb();
    }

    _onClear(){
        //TODO
        var clearBtn = document.querySelector(`.searchBar-${this.props.i} >.searchBar_clear`);
        clearBtn.classList.add("no-display");
        this.props.cbClear();
    }
    render(){
        return (
            <div className={`${searchBarClassName} ${searchBarClassName}-${this.props.i}`}>
                <div className={"searchBar_input"}>
                    <input type="text"/>
                </div>
                <div className={"searchBar_btn btn"} onClick={this._onSearch.bind(this)}>Search</div>
                <div className={"searchBar_clear no-display"} onClick={this._onClear.bind(this)}>Clear</div>
            </div>
        )
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
                    <div
                        className={
                            (this.props.filterCB?"filterBtn btn btn-primary":"")
                        }

                        onClick={this.props.filterCB}

                    >
                        {this.props.title}
                    </div>
                    <SearchBar i={this.props.i} cb={this.props.cb} cbClear={this.props.cbClear}></SearchBar>
                </div>
            </div>
        )
    }
}

class ClustersBox extends React.Component {
    constructor(props) {
        super(props);
        this.classname = clustersBoxClassName;

    }


    render(){
        const _ = this;
        let filter = this.props.filter;

        return (
            <div onScroll={_.props.scrollcb ? _.props.scrollcb.bind(_) : ()=>{}} className="col col-10 hideScrollBar clusters-box">
                {this.props.children}
            </div>
        )
    }
}




class SetAcceptedStatusBtn extends React.Component{
    constructor(props) {
        super(props);
        if(!this.props.accepted) {
            this.className = "ClusterCard_accept-btn "
            this.text = "accept"
        }

    }

    _handleClick(){
        print("you clicked me ")
        print("323: button clicked",this.props.accepted , this.props.id);
        this.props.cb(this.props.accepted, this.props.id, this.props.index)
    }

    render(){

        var className = this.props.accepted ?
            'ClusterCard_unaccept-btn' : "ClusterCard_accept-btn";
        var text = this.props.accepted ? 'unaccept':'accept';
        return (
            <div
                onClick={this._handleClick.bind(this)}
                className={className + " btn" }>
                {text}
            </div>
        )
    }
}


class ClusterCardHead extends React.Component {
    constructor(props) {
        super(props);
    }

    _onPick(){
        const _ = this;
        let clusterID = this.props.id; //TODO
        if(_.props.picking)
            _.props.giveMe(clusterID);
    }

    render( ) {
        const _ = this;
        let picking = _.props.picking;

        return (
            <div className={"row ClusterCard_head"}>
                <div
                    className={`col ClusterCard_title ` + (picking ? "btn btn-primary" : "")}
                    onClick={_._onPick.bind(this)}
                >
                    {this.props.title}
                </div>
                {/*<div className={"ClusterCard_close"}>X</div>*/}
                <SetAcceptedStatusBtn
                    accepted={this.props.accepted}
                    id={this.props.id}
                    cb={this.props.cb}
                    index={this.props.index}
                />
            </div>
        )
    }
}

class ClusterCardFeedbackEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * callback for remove feedback
     */
    onRemove(){
        var clusterID = this.props.clusterID || -666;   //TODO
        var sentenceID = this.props.id;
        var clusterIndex = this.props.clusterIndex;
        print("381: onRemove called: ", clusterID, sentenceID, clusterIndex);


        this.props.cb(clusterID, sentenceID, clusterIndex);
        //TODO
    }




    render() {
        var text = this.props.text;
        return (
            <div className={"row ClusterCard_feedback"}>
                <div className={"feedback_entry"}>{text}</div>
                <div onClick={this.onRemove.bind(this)} className={"feedback_remove btn"}>remove</div>
            </div>
        )
    }
}

class ClusterCardBody extends React.Component {
    constructor(props) {
        super(props);
    }


    render( ) {
        const _ = this;
        // print("735: ", this.props);
        var i = 0;
        return (
            <div className={"row ClusterCard_body hideScrollBar"}>
                <div className={"container_fluid ClusterCard_body_container hideScrollBar"}>
                    {
                        this.props.feedbacks.map(fb =>{
                            return <ClusterCardFeedbackEntry
                                key={i}
                                text={fb[0]}
                                id={fb[1]} //sentenceID
                                clusterID={this.props.clusterID}
                                cb={this.props.removeCB}
                                index={i++}
                                clusterIndex={this.props.clusterIndex}
                            />
                                // let textNid = _._processText(fb);
                                // if(!(textNid[1] === undefined))


                            }
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
        let accepted = this.props.accepted;
        let display = this.props.display ? "" : "no-display-until-lg"

        return (
            <div className={`ClusterCard ${display} ${accepted ? acceptedClassName : unacceptedClassName}`}>
                <div className={"container_fluid"}>
                    <ClusterCardHead
                        index={this.props.index}
                        cb={this.props.headCB}
                        id={this.props.id}
                        accepted={this.props.accepted}
                        title={this.props.title}
                        giveMe={this.props.giveMe}
                        picking={this.props.picking}
                    />
                    <ClusterCardBody
                        feedbacks={this.props.feedbacks}
                        removeCB={this.props.removeCB}
                        clusterID={this.props.id}
                        clusterIndex={this.props.index}

                    />

                </div>
                <div className={"addSentenceToMe"}></div>
            </div>
        );
    }
}

class ClusterWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const _ = this;
        return (
            <div  className={"container_fluid clustersWrapper"}>
                <div className="row" >
                    <LeftBtn cb={this.props.leftBtnClick}></LeftBtn>
                    <ClustersBox filter={this.props.filter} filterCB={this.props.filterCB} scrollcb={_.props.scrollcb}>{this.props.children}</ClustersBox>
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
        // var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        // if(current === null) return;
        // var prev = current.previousElementSibling;
        // if(prev=== null) return;
        // removeClass(prev, "no-display-until-lg");
        // addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div  className={"d-lg-none col col-1 leftBtn btn"}>
                <div onClick={this.handleClick.bind(this)}>{"<"}</div>
            </div>
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
        // var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        // if(current === null) return;
        // var next = current.nextElementSibling;
        // if(next === null) return;
        // removeClass(next, "no-display-until-lg");
        // addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div  className={"d-lg-none col col-1 rightBtn btn"}>
                <div onClick={this.handleClick.bind(this)}> {">"}</div>
            </div>
        )
    }
}





// ----------- SECTION 2 ----------------

class UnclusteredSentence extends React.Component {
    constructor(props) {
        super(props);
    }


    handlePickMe(){
        const _ = this;
        this.props.pickMe(_.props.sentence_id);
    }

    render(){
        // print("923: my props: ", this.props);
        return (
            <div className={"row unclustered-sentence"}>
                <div className={"col-8"}>{this.props.text}</div>
                <div className={"col-4 pickMeBtn"} onClick={this.handlePickMe.bind(this)}>PICK ME</div>
            </div>
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
                onScroll={_.props.cb ? _.props.cb.bind(_) : ()=>{}}
                className={"container_fluid unclusteredSentencesWrapper hideScrollBar"}>
                {this.props.children}
            </div>
        )
    }
}

