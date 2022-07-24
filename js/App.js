'use strict';


// ==================== CONSTANTS ====================
const searchBarClassName = "searchBar"; //TODO: refactor this in section class itself
// --------------------------------------
const clustersBoxClassName = "clusters-box";    //TODO  refactoring
const sentencesBoxClassName = "unclusteredSentencesWrapper"; //TODO refactoring
const clusterEndpoint = "clusters";
const sentencesEndpoint = "unclusteredsentences";
const clusterClassName = "ClusterCard";
const sentenceClassName = "unclustered-sentence";
const acceptedClassName = "accepted";
const unacceptedClassName = "unaccepted";


// ==================== COMPONENTS ====================
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
                <div className={"searchBar_btn"} onClick={this._onSearch.bind(this)}>Search</div>
                <div className={"searchBar_clear no-display"} onClick={this._onClear.bind(this)}>Clear</div>
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
        this.state = {
            loadedItems: [],
            tempItems: [], //temporary item storage (for search results, for example.)
            displayTemp: false // if true, display temporary items.
        }
        this._store = undefined;
        this._boxClassName = undefined;
        this._itemClassName = undefined;
        this._title = undefined;
        this._endpoint = undefined; //e.g. "api/endpoint"
        this._gettingSome = false;
    }

    /**
     * fetch item IDs from the API.
     * @param filter: (optional)  extra string to append to the queryString.
     * The resulting query string is "_endpoint/filter"
     * @return {Promise<void>}
     * @private
     */
    async _loadItemIDs(filter){
        let queryString = this._endpoint;
        if(filter){
            //TODO};
            queryString += "/";
            queryString += filter;
        }
        return this.props.q(queryString);
    }



    /**INITIATE A CLUSTER STORE AND RETURN IT
     * check the API documentation for the format of each item.
     *  @param filter: optional filter for loading item IDs.
     */
    async _initiateStore(filter){
        const _ = this;
        var itemIDs = this._loadItemIDs(filter);
        return itemIDs.then(arr => {
            return new Store(arr);
        })
    }

    /**
     *
     * @param ID
     * @return {Promise<void>}
     * @private
     */
    async _buildItem(ID){

    }


    /**
     * TODO refactor so that accepting/unaccepting a cluster
     * triggers this function instead of hardcoding the loading  process again.
     * @return {Promise<void>}
     * @private
     */
    async _loadItem(itemID, to){
        //TODO
    }
    /**
     * loads n items
     * @param n
     * @param recurse if true, call itself to get more cards
     * @param from Object (optional) a Store object to load from. If undefined, load from this._store instead.
     * @param to Array (optional) where to store the loaded items. If undefined, store in this.tate.loadedItems array.
     * @return {Promise<void>}
     */
    async _loadItems(n=5, recurse=false, from, to){
        const _ = this;
        if(_._gettingSome) return; // do not get some when we are still getting some.
        if(from === undefined) from = this._store;

        _._gettingSome = true;
        const bunch = from.getSome(n);
        if(bunch.length < 1) return;
        var itemPromises = [];
        bunch.forEach(item => {
            itemPromises.push(_._buildItem(item.id));
        })

        //store the loaded items.
        return Promise.all(itemPromises).then( vals => {
            if(to === undefined){
                _.state.loadedItems.push(...vals);
                _.setState({
                    loadedItems: _.state.loadedItems
                })
            }else{
                to.push(...vals)
            }
            _._gettingSome = false;

            if(recurse) _._loadItems(n);
        })
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
                // print("App.js 168: bottom reached!", _._loadItems);
                _._loadItems();
            }

        }

        return f
    }


    /**
     * hide/unhide all items currently on display, by toggling their display(hide -> display = none)
     */
    _toggleDisplayedItems(){
        //TODO
        print("app.js toggleDisplayedItems called!");
        var currentDisplayTemp = this.state.displayTemp;
        //
        // document.querySelector("."+this._itemClassName).classList.toggle("no-display")
        this.setState({
            displayTemp: !currentDisplayTemp
        })
    }

    _displayTempItems(){
        this.setState({
            displayTemp: true
        })
    }


    _displayLoadedItems(){
        this.setState({
            displayTemp: false
        })
    }


    /**
     * TODO event handler for undoing the result of onSearch()
     */
    onClear(){

        print("145: onClear called");

        this._displayLoadedItems();

    }

    /**
     * event handler for the search button.
     */
    onSearch(){

        // clear out the temp items array, before loading it.
        this.setState({
            tempItems: []
        });
        print("App.js 36", this , this.props.i);
        //TODO print the inputted text
        var field = document.querySelector(`.${searchBarClassName}-${this.props.i} > .${searchBarClassName}_input > input`);
        print("app.js 69: ", field.value);
        //TODO print the query function
        print("app.js 71: ", this.props.q);
        //TODO do a query, but use the inputted text as a filter.
        var prom = this._initiateStore(field.value);
        prom.then(store => {
            print("app.js 113: ", store);

        //TODO print the load method
            print("app.js 86: ", this._loadItems);
        //TODO load the fetched items to some array.
            this._loadItems(-1,
                false,
                store,
                this.state.tempItems)
                .then(val => {
                    this.setState(this.state);
        //TODO print the box
                    print("app.js 158: ", this._boxClassName );

        //TODO print the loaded temporary items.
                    print("app.js 160: ", this.state.tempItems);
        //TODO hide current items
                    this._displayTempItems();
        //TODO load the temporary items into view.

                })
        })
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
                    <div className={this.props.filterCB?"filterBtn btn btn-primary":""} onClick={this.props.filterCB}>{this.props.title}</div>
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
            <div onScroll={_.props.scrollcb.bind(_)} className="col col-10 hideScrollBar clusters-box">
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
            <div onClick={this._handleClick.bind(this)} className={className }>{text}</div>
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
                <div onClick={this.onRemove.bind(this)} className={"feedback_remove"}>remove</div>
            </div>
        )
    }
}

class ClusterCardBody extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * TODO: a little ugly
     * (the text format is "text$fbid") seperate
     * the text and feedbackid. return an array
     * @return Array [text, ID]
     */
    _processText(rawText) {
        //TODO
        if(!rawText) return [undefined, undefined];
        var rawArr = rawText.split('');
        var index = rawArr.lastIndexOf('$');

        let text = rawArr.splice(0, index);
        rawArr.shift();
        let fbID = Number(rawArr.join(''));
        // print("fbID: ", fbID);
        return [text.join(''), fbID];
    }


    render( ) {
        const _ = this;
        var i = 0;
        return (
            <div className={"row ClusterCard_body hideScrollBar"}>
                <div className={"container_fluid ClusterCard_body_container hideScrollBar"}>
                    {
                        this.props.feedbacks.map(fb =>{
                            let textNid = _._processText(fb);
                            if(!(textNid[1] === undefined))

                                return <ClusterCardFeedbackEntry
                                    key={i}
                                    text={textNid[0]}
                                    id={textNid[1]} //sentenceID
                                    clusterID={this.props.clusterID}
                                    cb={this.props.removeCB}
                                    index={i++}
                                    clusterIndex={this.props.clusterIndex}
                                />
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
                    <ClusterCardHead index={this.props.index} cb={this.props.headCB} id={this.props.id} accepted={this.props.accepted} title={this.props.title}></ClusterCardHead>
                    <ClusterCardBody
                        feedbacks={this.props.feedbacks}
                        removeCB={this.props.removeCB}
                        clusterID={this.props.id}
                        clusterIndex={this.props.index}
                    />
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
        var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        if(current === null) return;
        var prev = current.previousElementSibling;
        if(prev=== null) return;
        removeClass(prev, "no-display-until-lg");
        addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div  className={"d-lg-none col col-1 leftBtn"}>
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
        var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        if(current === null) return;
        var next = current.nextElementSibling;
        if(next === null) return;
        removeClass(next, "no-display-until-lg");
        addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div  className={"d-lg-none col col-1 rightBtn"}>
                <div onClick={this.handleClick.bind(this)}> {">"}</div>
            </div>
        )
    }
}


class Section1 extends Section {
    /**
     * cards are built from this.state.loadedItems,
     * where each item is an object associated with a cluster.
     * @param props
     */
    constructor(props) {
        super(props);
        // this.state.displayALl = true;
        // this.state.displayAccepted = true;
        this.state._activeCardIndex = 0;
        this.state.filter = 0;  // 0 for display all, 1 for accepted only, 2 for unaccepted only

        this._boxClassName = clustersBoxClassName;
        this._endpoint = clusterEndpoint;
        this._itemClassName = clusterClassName;
    }




    /**
     * resets the active item index to 0.
     * @private
     */
    _resetIndex(){
        this.setState({
            _activeCardIndex: 0
        })
    }

    _decrementIndex(){
        var val = this.state._activeCardIndex;
        this.setState({
            _activeCardIndex: val-1
        })
    }

    _displayTempItems(){
        this._resetIndex();
        super._displayTempItems();
    }


    /**
     * grab the feedback entries associated to a cluster.
     * @param clusterID
     * @return Object {title, feedbacks, accepted, id, ...}
     * @private
     */
    async _buildItem(clusterID){
        const q = this.props.q;
        const cluster = q(`cluster/${clusterID}`);
        const feedbacks = q(`clusterfeedbacks/${clusterID}`);
        return Promise.all([cluster, feedbacks]).then(values => {
            const  cluster = values[0][0], feedbacks = values[1];
            return {
                title: cluster.title,
                feedbacks,
                accepted: cluster.accepted,
                id: clusterID
            }
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
                _._loadItems(5)
            })
    }

    _incrementIndex(){
        var val = this.state._activeCardIndex;
        this.setState({
            _activeCardIndex: val+1
        })
    }


    /**
     * toggles the filter between the three modes.
     * @private
     */
    _filterDisplay(){
        print("594: filter called");
        let newFilter = this.state.filter + 1;

        this.setState({
            filter: newFilter > 2 ? 0 : newFilter,
            _activeCardIndex: 0
        })



        //TODO
    }

    onRightBtnClick(){
        var items = this.state.displayTemp ? this.state.tempItems : this.state.loadedItems;
        var currentindex = this.state._activeCardIndex;
        if(currentindex + 1 < items.length) this._incrementIndex();
        print("App.js 278: ", this.state._activeCardIndex);
        if(!this.state.displayTemp && (items.length - this.state._activeCardIndex) < 4){
            print("278: loading more cards. ")
            this._loadItems()
        }
    }

    onLeftBtnClick(){

        var currentindex = this.state._activeCardIndex;
        if(currentindex > 0) this._decrementIndex();
        print(this.state._activeCardIndex)
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
            print("app.js 597, ", accepted, id, index);

            //TODO send request to API
            let queryString = accepted ? "unacceptcluster/" : "acceptcluster/";
            queryString += id;
            var changeStatusPromise = q(queryString);
            changeStatusPromise.then(val => {
                //TODO  trigger a reload
                //  TODO 1. fetching  this cluster again
                var clusterPromise = _._buildItem(id);
                clusterPromise.then(cluster => {
                    print("637: updated cluster: ", cluster)
                    //TODO 2. swap this with the old one in the current items array.
                    let items = _.state.displayTemp ? _.state.tempItems : _.state.loadedItems;
                    items[index] = cluster;
                    //TODO 2 then setstate to trigger a rerendering.
                    if(_.state.displayTemp) {
                        _.setState({
                            tempItems: items
                        })
                    }else{
                        _.setState({
                            loadedItems: items
                        })
                    }
                })


            })



        }

        return toggler;
    }

    /**
     * for removing a feedback entry from a cluster card.
     */
    onRemoveFeedback(){
        const _ = this;
        const q = _.props.q;



        function f(clusterID, sentenceID, cardIndex){
            print("729: remove feedback called with: ", clusterID, sentenceID, cardIndex);
            //send a remove query to the API
            var v = true;
            if(clusterID != -666 && v){
                q(`removesentence/${clusterID}/${sentenceID}`)
                    .then (val => {
                        _._buildItem(clusterID).then(cluster => {
                            //TODO
                            let index = cardIndex;
                            print("637: updated cluster: ", cluster)
                            //TODO 2. swap this with the old one in the current items array.
                            let items = _.state.displayTemp ? _.state.tempItems : _.state.loadedItems;
                            items[index] = cluster;
                            //TODO 2 then setstate to trigger a rerendering.
                            if(_.state.displayTemp) {
                                _.setState({
                                    tempItems: items
                                })
                            }else{
                                _.setState({
                                    loadedItems: items
                                })
                            }


                        })
                    })
            }
            //
            // var itemPromise = _._buildItem(itemID);
            // itemPromise.then( item => {
            //
            // })
            //on resolve, fetch the cluster

                // on resolve, set state
        }

        return f;
    }
    /**
     * //TODO refactor this into Section Class. Same with Section2
     * @return {JSX.Element}
     */
    render(){
        print("804: new filter value: ", this.state.filter);
        const _ = this;
        var items = this.state.displayTemp ? this.state.tempItems : this.state.loadedItems;
        var filter = {
            displayAll: _.state.filter === 0,
            displayAccepted: !(_.state.filter === 2)
        }
        var title = filter.displayAll
            ? "All Cluster"
            : filter.displayAccepted
                ? "Accepted Clusters"
                : "Unaccepted Clusters";
        items =  items.filter(child => {
            return (filter.displayAll ||
                (filter.displayAccepted && child.accepted) ||
                (!filter.displayAccepted && !child.accepted))
        });
        //load more, if items is 0
        print("818: items: ", items);

        return (

            <div className={"row main_section1"}>
                <SectionHead
                    filterCB={this._filterDisplay.bind(this)}
                    i={1}
                    cb={this.onSearch.bind(this)}
                    cbClear={this.onClear.bind(this)}
                    title={title}/>
                <SectionBody>
                    <ClusterWrapper
                        scrollcb={_._handleScroll()}
                        leftBtnClick={this.onLeftBtnClick.bind(this)}
                        rightBtnClick={this.onRightBtnClick.bind(this)}
                        filter={filter}>
                        {items.map((cardInfo, index) => {
                                let accepted = cardInfo.accepted;
                                return <ClusterCard key={index}
                                                    title={cardInfo.title}
                                                    accepted={accepted}

                                                    feedbacks={cardInfo.feedbacks}
                                                    display={index === _.state._activeCardIndex}
                                                    headCB={this._toggleAcceptedStatus()} //the callback function for (un)acceptBtn
                                                    id={cardInfo.id}
                                                    index={index}
                                                    removeCB={this.onRemoveFeedback()} //remove a feedback entry
                                >
                                </ClusterCard>
                            }

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
    constructor(props) {
        super(props);
        this._boxClassName = sentencesBoxClassName;
        this._endpoint = sentencesEndpoint;
        this._itemClassName = sentenceClassName;

    }

    /**
     *
     * @param clusterID
     * @return
     * @private
     */
    async _buildItem(sentenceID){
        const q = this.props.q;
        const sentence = q(`sentence/${sentenceID}`);

        return sentence.then(val => val[0]);
    }

    componentDidMount(){
        const _ = this;
        const q = this.props.q;
        print("I(SECTION2) MOUNTED!");
        _._initiateStore()
            .then(store => {
                _._store = store;
                print("section 2: ", store.getAll());
                _._loadItems(10, false);

            })
    }

    render(){
        const _ = this;
        var items = this.state.displayTemp ? this.state.tempItems : this.state.loadedItems;
        return (
            <div className={"row main_section2"}>
                <SectionHead i={2} cb={this.onSearch.bind(this)} cbClear={this.onClear.bind(this)} title="Unclustered Sentences"></SectionHead>
                <SectionBody>
                    <UnclusteredSentencesWrapper cb={(this._handleScroll)()} loadMore={()=>{_._loadItems(5,false)}}>
                        {items.map((sentence, index) =>
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