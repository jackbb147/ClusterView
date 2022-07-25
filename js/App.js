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
            itemManagers:[]
        }
        this._boxClassName = undefined;
        this._itemClassName = undefined;
        this._title = undefined;
        this._endpoint = undefined; //e.g. "api/endpoint"
        this._gettingSome = false;
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
                print("manager initiated!");

                print("99: ", _.state.itemManagers);
                //after initiating, call setState to trigger a re-render.
                _.setState({
                    itemManagers: [manager]
                })
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

class Section1 extends Section {
    /**
     * cards are built from this.state.loadedItems,
     * where each item is an object associated with a cluster.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state.filter = 0;  // 0 for display all, 1 for accepted only, 2 for unaccepted only
        this._boxClassName = clustersBoxClassName;
        this._endpoint = clusterEndpoint;
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
        // print("818: items: ", items);

        return (

            <div className={"row main_section1"}>
                <SectionHead>

                </SectionHead>

                <SectionBody>
                    <ClusterWrapper>

                    </ClusterWrapper>
                </SectionBody>
                {/*<SectionHead*/}
                {/*    filterCB={this._filterDisplay.bind(this)}*/}
                {/*    i={1}*/}
                {/*    cb={this.onSearch.bind(this)}*/}
                {/*    cbClear={this.onClear.bind(this)}*/}
                {/*    title={title}/>*/}
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
                {/*                                    display={index === _.state._activeCardIndex}*/}
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
        super(props);
        this._boxClassName = sentencesBoxClassName;
        this._endpoint = unclusteredSentencesEndpoint;
        this._itemClassName = sentenceClassName;

    }


    //TODO active index should always be at the end,
    // SO that when triggering a loadMore, ...


    async componentDidMount() {
        const _ = this;
        return super.componentDidMount().then(() => {
            let manager = _.state.itemManagers[0];
            manager.setActiveIndex(manager.count()-1);
            print("778: ", manager.getActiveIndex());
        })
    }

    render(){
        const _ = this;
        let manager = _.state.itemManagers[0];
        let items = manager
            ? manager.getAllItems().map(item => item[0])  // because item is an array of length 1. (See API documentation)
            : [];   //TODO: refactor
        print("425: items: ", items);
        return (
            <div className={"row main_section2"}>
                <SectionHead>
                </SectionHead>
                <SectionBody>
                    <UnclusteredSentencesWrapper>
                        {items.map((sentence, index) =>
                            <UnclusteredSentence
                                key={index}
                                text={sentence.sentence_text}/>
                        )}
                    </UnclusteredSentencesWrapper>
                </SectionBody>
                {/*<SectionHead i={2} cb={this.onSearch.bind(this)} cbClear={this.onClear.bind(this)} title="Unclustered Sentences"></SectionHead>*/}
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


    render() {
        return   (
            <div className={"container main"}>
                <Section1 i={1} q={this.props.q}></Section1>
                <Section2 i={2} q={this.props.q}></Section2>
            </div>
        )
    }
}

const PRODUCTION = true;
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
            <div onClick={this._handleClick.bind(this)} className={className + " btn" }>{text}</div>
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
                <div onClick={this.onRemove.bind(this)} className={"feedback_remove btn"}>remove</div>
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
        var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        if(current === null) return;
        var next = current.nextElementSibling;
        if(next === null) return;
        removeClass(next, "no-display-until-lg");
        addClass(current, "no-display-until-lg");

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

    render(){
        print("848: my text: ", this.props.text);
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
                onScroll={_.props.cb ? _.props.cb.bind(_) : ()=>{}}
                className={"container_fluid unclusteredSentencesWrapper hideScrollBar"}>
                {this.props.children}
            </div>
        )
    }
}

