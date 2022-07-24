'use strict';


const searchBarClassName = "searchBar"; //TODO: refactor this in section class itself
// --------------------------------------
const clustersBoxClassName = "clusters-box";    //TODO  refactoring
const sentencesBoxClassName = "unclusteredSentencesWrapper"; //TODO refactoring
const clusterEndpoint = "clusters";
const sentencesEndpoint = "unclusteredsentences";
const clusterClassName = "ClusterCard";
const sentenceClassName = "unclustered-sentence";
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
     * loads n items
     * @param n
     * @param recurse if true, call itself to get more cards
     * @param from Object (optional) a Store object to load from. If undefined, load from this._store instead.
     * @param to Array (optional) where to store the loaded items. If undefined, store in this.tate.loadedItems array.
     * @return {Promise<void>}
     */
    async _loadItems(n=5, recurse=false, from, to){
        const _ = this;
        if(from === undefined) from = this._store;

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

            if(recurse) _._loadItems(n);
        })
    }


    /**
     * TODO event handler for undoing the result of onSearch()
     */
    onClear(){
        print("145: onClear called");
        //TODO (may actually not be necessary to clear the temp items at this point.)
        this._toggleDisplayedItems();

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
                    this._toggleDisplayedItems();
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
                    <div>{this.props.title}</div>
                    <SearchBar i={this.props.i} cb={this.props.cb} cbClear={this.props.cbClear}></SearchBar>
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
    constructor(props) {
        super(props);
        this._activeCardIndex = 0;//index of the card currently on display.
        this._boxClassName = clustersBoxClassName;
        this._endpoint = clusterEndpoint;
        this._itemClassName = clusterClassName;
    }


    /**
     * grab the feedback entries associated to a cluster.
     * @param clusterID
     * @return
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
                feedbacks
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
                _._loadItems(3)
            })
    }



    onRightBtnClick(){

        var currentindex = this._activeCardIndex;
        if(currentindex + 1 < this.state.loadedItems.length) this._activeCardIndex++;
        print("App.js 278: ", this._activeCardIndex);
        if((this.state.loadedItems.length - this._activeCardIndex) < 4){
            print("278: loading more cards. ")
            this._loadItems()
        }
    }

    onLeftBtnClick(){

        var currentindex = this._activeCardIndex;
        if(currentindex > 0) this._activeCardIndex -= 1;
        print(this._activeCardIndex)
    }


    /**
     * //TODO refactor this into Section Class. Same with Section2
     * @return {JSX.Element}
     */
    render(){
        const _ = this;
        var items = this.state.displayTemp ? this.state.tempItems : this.state.loadedItems;
        return (
            <div className={"row main_section1"}>
                <SectionHead i={1} cb={this.onSearch.bind(this)} cbClear={this.onClear.bind(this)} title="All Clusters"></SectionHead>
                <SectionBody>
                    <ClusterWrapper leftBtnClick={this.onLeftBtnClick.bind(this)} rightBtnClick={this.onRightBtnClick.bind(this)}>
                        {items.map((cardInfo, i) =>

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

    handleScroll(){
        //TODO TRIGGER A LOAD SENTENCE()
        const _ = this;
        function f(){
            const classname = "."+this.classname;
            const el = document.querySelector(classname);

            if(el.scrollTop  + el.clientHeight >= 0.8 * el.scrollHeight){
                print("App.js 447: bottom reached!", _._loadItems);
                _._loadItems();
            }

        }

        return f
    }

    render(){
        const _ = this;
        var items = this.state.displayTemp ? this.state.tempItems : this.state.loadedItems;
        return (
            <div className={"row main_section2"}>
                <SectionHead i={2} cb={this.onSearch.bind(this)} cbClear={this.onClear.bind(this)} title="Unclustered Sentences"></SectionHead>
                <SectionBody>
                    <UnclusteredSentencesWrapper cb={(this.handleScroll)()} loadMore={()=>{_._loadItems(5,false)}}>
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