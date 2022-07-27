'use strict';


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
            _managerIndex: 0, //which manager to use.
            refreshIndicesStore : new NoDuplicateStore() // indices of items that need to be refreshed .
        }
        this._boxClassName = undefined;
        this._itemClassName = undefined;
        this._title = undefined;
        this._endpoint = undefined; //e.g. "api/endpoint"
        this._gettingSome = false;
        this._filter = 0;


    }


    get refreshIndicesStore(){return this.state.refreshIndicesStore}

    set refreshIndicesStore(newArr){
        this.setState({
            refreshIndicesStore: newArr
        })
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
        this.whichManager = 0;
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
        let managers = _.managers;

        return manager.initiate(10)
            .then(() => {
                // print2("189: managers: ", managers);
                P("196: initated: ", manager);
                managers.push(manager);
                _.managers = managers;
                _.whichManager = _.managers.length-1;

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
    /**
     * perform a hot reload of the items at given indices.
     * @param indices
     * @return {Promise<void>}
     */
    async hotReload(indices, endpoint){
        const _ = this;
        // P("hot reload called: ")
        // print2("hot reload called from ", this);
        // P("HOT RELOAD");
        // print2("INDICES: ", indices, this );
        // if(indices === undefined) return;
        // if(indices.length > 0)
        // {

        //     P("HOT RELOADING")
        //     let indices = indices.filter(i => !(i===undefined));
        //     print2("INDICES:", indices);
        //     Promise
        //         .all(indices
        //             .map(i=>_.manager.update(i, endpoint)))
        //         .then(newManager => {
        //             // P("259: THEN: ", newManager);
        //             _.manager = newManager;
        //             if(_.props.refreshIndexCB) _.props.refreshIndexCB();
        //         })
        //     _
        // }
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
        * send api query , then hot reload this item.
        * @return {*}
    */
    onRemoveFeedback(){
        const   _ = this,
                q = _.props.q,
                manager = _.manager;

        /**
         *
         * @param clusterID
         * @param sentenceID
         * @param itemIndex
         */
        function f(clusterID, sentenceID, itemIndex){
            print2(
                "357: remove feedback called with: ",
                clusterID,
                sentenceID,
                itemIndex,
            );

            _.refreshIndicesStore.append([clusterID]);

            print2(_.refreshIndicesStore.getItems())

            _.manager
                .update(
                    itemIndex,
                    "removesentence",
                    clusterID,
                    sentenceID
                )
                .then (newManager => {
                    _.manager = newManager;
                    _.props.onRemoveFeedbackEntry(sentenceID);

                })
        }

        return f;
    }


    onReceiveSentences(){
        function f(clusterID, clusterIndex){
            const _ =this;
            let sentences = this.props.pickedSentences;
            let manager = this.manager;
            P("482: YOU CLICKED ME: see console ", clusterID, clusterIndex )
            print2(this, clusterID, clusterIndex, sentences, q)

            //TODO send API query.
            Promise.all(
                sentences.map(sentenceID => manager.update(clusterIndex, "addsentence", clusterID, sentenceID))
            )
                .then(val => {
                    _.manager = _.manager; //trigger a rerendering.
                })


            this.props.onReceiveSentences(sentences)
        }


        return f.bind(this);
    }

    render(){
        const _ = this;
        let picking = false
        if(this.props.pickedSentences.length > 0 )
            picking = true;
        //
        // if(_.props.refreshIndex)
        //     _.hotReload([_.props.refreshIndex],"cluster");
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
                    picking={picking}

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
                                                onRemoveFeedbackEntry={this.onRemoveFeedback()}
                                                // giveMe={this.props.giveMe}
                                                picking={picking}
                                                onReceiveSentences={this.onReceiveSentences()}
                                                // refreshIndexCB={this.props.refreshIndexCB}
                            />
                    })}
                    </ClusterWrapper>
                </SectionBody>

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

    /**
     * a sentence has been unclustered!
     */
    async welcomeNewMember(newSentenceIDs){
        const _ = this;
        print2(
            "welcome new member! I am: ",
            this,
            newSentenceIDs
        );
        //TODO send API query,
        _.processRemovedSentences(newSentenceIDs)
            .then(v => {
                _.props.removedFeedbackSentenceIDsCallback(newSentenceIDs)
            })
    }


    //TODO active index should always be at the end,
    // SO that when triggering a loadMore, ...

    async processRemovedSentences(newSentenceIDs){
        const _ = this;
            // pop and load.
            let manager = _.manager;
            let ids = newSentenceIDs;
            let promises = ids.map( id =>
                //TODO
                _.manager.fetchOneID(id) .then (m => manager = m)
            )


            return Promise.all(promises).then(()=>{_.manager = manager});
    }

    addToClusterCB(){
        const _ =this;


        function f(sentenceID, index){

            print2(this);
            let store = _.refreshIndicesStore;
            store.append([index])
            print3(store, store.getItems());
            _.refreshIndicesStore = store;

            //TODO maybe "delete" this item with this index



            _.props.addToClusterCB(sentenceID);
        }

        return f.bind(this);
    }

    handleRefreshIndices(){
        if(this.props.addedToCluster && this.refreshIndicesStore.notEmpty())
        {
            const _ = this;
            P2("handling refresh indices")
            print3("handle refresh indices: ",  this.refreshIndicesStore.getItems())
            //TODO send API query.
            _.manager.setID()
            _.refreshIndicesStore.getItems().map(index=>{
                _.manager.setID(index, undefined)
                _.manager.setItem(index, undefined);
                _.refreshIndicesStore.clear()
                _.manager = _.manager; //trigger a rerendering.

            });


        }
    }

    render(){
        const _ = this;



        let newSentenceIDs = _.props.removedFeedbackSentenceIDs
        if(newSentenceIDs.length > 0){
            _.welcomeNewMember(newSentenceIDs)
        }
        this.handleRefreshIndices();



        // if(
        //     _.props.pickedSentenceStore &&
        //     _.props.pickedSentenceStore.notEmpty()
        //     && this.props.addedToCluster){
        //     this.hotReload();
        //     // _.hotReload(_.props.pickedSentenceStore.getItems(), "sentence");
        // }
        // // this.handleRefresh();
        // if(_.props.refreshSentenceStore.notEmpty()){
        //     P("has things to refresh!");
        //     //     super.hotReload(_.props.refreshSentenceStore.getItems(), "sentence")
        // }

        let items = this.items;
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
                        {
                            if(sentence === undefined) return;
                            return <UnclusteredSentence
                                key={index}
                                text={sentence.sentence_text}
                                // pickMe={_.props.pickMe}
                                sentence_id={sentence.id}
                                addToClusterCB={this.addToClusterCB()}
                                index={index}
                            />
                        }
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
        this.state = {
            _removedFeedbackSentenceIDStore : new NoDuplicateStore(),    //removed from cluster.
            // if empty, the user didn't select any sentences to be dropped in to cluster.
            pickedSentenceStore: new NoDuplicateStore(),   //added to cluster, removed from section2.
            addedToCluster: false, //true if picked sentences have been added to cluster.
            picking: false,
        }
    }
    
    get addedToCluster(){
        return this.state.addedToCluster
    }
    
    set addedToCluster(bool){
        P2("750 added to cluster setter called: ", bool)
        this.setState({
            addedToCluster: bool
        })
    }

    /**
     * is the user picking a sentence(to add to a cluster? )
     * @return {boolean}
     */
    get picking() {
        // TODO
        return this.pickedSentenceStore.notEmpty()
    }

    get pickedSentenceStore(){
        return this.state.pickedSentenceStore
    }

    set pickedSentenceStore(obj){
        this.setState({pickedSentences: obj})
    }

    get removedFeedbackSentenceIDs(){
        const _ = this;
        let store = _.state._removedFeedbackSentenceIDStore;
        return store.getItems();
    }

    set removedFeedbackSentenceIDs(newArr){
        if(newArr === undefined) return;
        let store = this.state._removedFeedbackSentenceIDStore;
        store.setItems(newArr);
        this.setState({
            _removedFeedbackSentenceIDStore: store
        })
        // this.setState({
        //     _removedSentences: newObj
        // })
    }

    onRemoveFeedbackEntry( ){
        const _ = this;
        function f(sentenceID){
            print2(
                "onremovefeedbackentry called: i am: ",
                _,
                "sentence id: ",
                sentenceID
            )
            let IDs = _.removedFeedbackSentenceIDs;
            IDs.push(sentenceID);
            _.removedFeedbackSentenceIDs = IDs;
        }

        return f.bind(this);
    }


    /**
     * call back passed to section 2 for adding sentence to cluster.
     */
    handleAddSentenceToCluster(){

        const _ = this;
        function f(sentenceID){
            P("line 752: YOU CLICKED ME. I AM: SEE CONSOLE", sentenceID);
            print2(_)
            _.addedToCluster = false;
            _.pickedSentenceStore.append([sentenceID]);
            _.pickedSentenceStore = _.pickedSentenceStore; // to trigger a rerender
            print2("picked sentences: ", _.pickedSentenceStore.getItems())
        }

        return f.bind(this)
    }


    _clearFrom(store, items)
    {
        P(
            "800: trying to clear: ",
            items,
            " from: ",
            store)
        items.map(item => store.removeItem(item));
        P("after clearing: see console", )
    }

    //TODO some refactoring can be done to merge the two clear callbacks into just one
    /**
     * delete the given ids from removedsentencefeedbackids.
     * @param ids
     */
    clearFromRemovedSentenceFeedbackIDs(){
        const _ =this;
        function f(ids){
            _._clearFrom(_.removedFeedbackSentenceIDStore, ids)
            _.removedFeedbackSentenceIDStore = _.removedFeedbackSentenceIDStore
        }
        return f.bind(this);
    }

    get removedFeedbackSentenceIDStore(){
        return  this.state._removedFeedbackSentenceIDStore;
    }

    set removedFeedbackSentenceIDStore(store){
        const _ =this;
        _.setState({
            _removedFeedbackSentenceIDStore: store
        })
    }




    clearFromPickedSentenceStore()
    {
        const _ =this;
        function f(ids){
            P2("871: clear from picked sentences");
            _._clearFrom(_.pickedSentenceStore, ids)
            _.pickedSentenceStore = _.pickedSentenceStore //to trigger a rerender
            _.addedToCluster = true;
        }
        return f.bind(this);
    }
    render() {
        return   (
            <div className={"container main"}>
                <Section1 i={1}
                          q={this.props.q}

                          pickedSentences={this.pickedSentenceStore.getItems()}
                            onRemoveFeedbackEntry={this.onRemoveFeedbackEntry()}
                          onReceiveSentences={this.clearFromPickedSentenceStore()}

                />
                <Section2 i={2}
                          q={this.props.q}
                          removedFeedbackSentenceIDs={this.removedFeedbackSentenceIDs}
                          removedFeedbackSentenceIDsCallback={this.clearFromRemovedSentenceFeedbackIDs()}
                          addedToCluster={this.addedToCluster}
                          addToClusterCB={this.handleAddSentenceToCluster()}
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
