/**
 * stores a list, where each item in the list is
 * the information needed to build that item for view.
 * TWO TYPES OF THINGS STORED:
 *      item id: e.g. cluster/46904, sentence/12389
 *      item: the actual item.
 *
 * TWO ENDPOINTS:
 *      first one is for:   //TODO
 *      second one is for:  //TODO
 *
 *
 * NOTE: ALWAYS ASSUME idstore.items[i] <-> itemstore.items[i]
 * DO NOT HARD REMOVE ANY ITEMS FROM ANY OF THE TWO STORE,
 * TO PREVENT MISALIGNMENT.
 *
 * Section1 has a(or multiple, for filtering) ClustersManager(s),
 * Section2 has a Sentences manager.
 */
class SectionItemManager {
    /**
     * DO NOT REMOVE ELEMENTS

     * @param q
     * @param filter
     */
    constructor(q, endpoints, filter=0 ) {
        this._itemstore = new Store();
        this._endpoints = endpoints; //e.g "/cluster/", or "/sentence"
        this._itemIDstore = new Store()
        this._filter = filter;  //0: all, 1:accepted only, 2: unacceptedonly
        this._q = q;
        this._activeindex = 0;

        this._gettingsome = false;  //is a query pending?
    }

    get idstore(){
        return this._itemIDstore;
    }

    get itemstore(){
        return this._itemstore;
    }

    get gettingsome(){
        return this._gettingsome;
    }

    /**
     *
     */
    get needsome(){
        return this.count() === this.activeIndex+1
            || (this.activeIndex - this.count()) < 5 //arbitrary
    }

    set gettingsome(bool){
        this._gettingsome = bool;
    }


    set filter(newFilter){
        //TODO
        //TODO there's supposed to be some major logic here
        // this._filter = newFilter;
        this._filter = newFilter;

        this._updateActiveIndex();
    }

    _updateActiveIndex(){
        let nearestLeft =  this._nearestNeighbor(-1);

        if(this._isValidIndex(nearestLeft)){
            print2(" setting index to nearest LEFT: ", nearestLeft);
            this.activeIndex = nearestLeft;
        }
        else{
            let nearestRight = this._nearestNeighbor(1);
            if(this._isValidIndex(nearestRight)){
                print2(" setting index to nearest RIGHT: ", nearestRight);
                this.activeIndex = nearestRight;
            }else{
                P("no nearest left, and no nearest right!")
            }
        }
    }

    get filter(){
        return this._filter;
    }

    /**
     * find the index of the nearest neighbor of the
     * current active index that is not filtered out.
     * if none is found, return active index instead.
     * @private
     */
    _nearestNeighbor(increment){
        //TODO handle when increment is undefined
        print2("nearest neighbor(): increment: ", increment);
        const _ = this;
        let walker = _.activeIndex;
        do{
            walker += increment;
        }while(
            walker >= 0 &&
            walker < _.count() &&
            _._isfilteredOut(walker)
        )
        return this._isValidIndex(walker) ? walker : this.activeIndex;

        // return 2;
        // let next = increment
        // for(let i = 0;  next < _.count() && next >= 0 ; next += increment, i++){
        //     print2("next: ", next);
        //     if( !this._isfilteredOut(next) && !(next ===_.activeIndex) ){
        //         print2("returning: ", next)
        //         return next;
        //     }
        // }


        // next = _.activeIndex;
        // print2("70: next: ", next, _._itemstore, "increment: ", increment);
        // return next;
    }

    /**
     *  an index is invalid when: it is out of bounds, or it is filtered out.
     * @param index
     * @return {boolean}
     * @private
     */
    _isValidIndex(index){
        //TODO
        const _ = this;
        if(index < 0 || index >= this.count() || _._isfilteredOut(index))
            return false
        return true;
    }

    get activeIndex(){
        return this._activeindex;
    }

    //TODO
    /**
     * check if the item at the given index is filtered out.
     * @param index
     * @return {boolean}
     * @private
     */
    _isfilteredOut(index) {

        const _ = this;
        let item = _.getAt(index);
        // P("index: ", index, "item accepted: ", item.accepted)
        // print2("is filtered out called with item: ", item, "filter: ", _.filter)
        print2("FILTER: ", _.filter);
        switch (_.filter) {
            case 0:
                return false;
            case 1:
                print2("index: ", index, "filtered out? ", !Boolean(item.accepted) )
                return !Boolean(item.accepted);
            case 2:
                return Boolean(item.accepted);
        }
    }


    set activeIndex(newIndex)
    {
        const _ = this;
        if (!_._isValidIndex(newIndex)) {
            print2("not a valid index: ", newIndex);
            let forward = newIndex >= this.activeIndex;
            let nearest = this._nearestNeighbor(forward ? 1 : -1);
            this.activeIndex = nearest;

        } else
        {
            let forward = newIndex > _.activeIndex;
            _._activeindex = newIndex;
            if(
                forward
                && _.needsome
                && _.count() < _._itemIDstore.count()
                && !_.gettingsome
            ){
                _.gettingsome = true;
                _._replenishInventory().then(()=>{
                    _.gettingsome=false
                });
            }
        }

    }



    /**
     * fetch more items, then append to items list.
     * @private
     */
    async _replenishInventory(){

        const _ = this;

        let newItemPromises = _._prepItems(5, _.count());
        return newItemPromises.then(items => {
            _.stockUp(items);

        })
    }


    /**
     * call this to initiate the item manager.
     * @return {Promise<Awaited<*>[]>}
     * @private
     */
    async initiate(n){
        const _ = this;
        print("SectionItemManager: 86: ", _);
        let queryString = `${_._endpoints[0]}` //TODO

        if(this._filter) queryString += `/${this._filter};`
        return _._initiateIDStore(queryString)
            .then(() => _._initiateItemStore(n));
    }

    /**
     * How many items do I currently have?
     * @return {number}
     */
    count(){
        return this._itemstore.count();
    }

    /**
     * get the item at index i.
     * @param i if i is -1, get ALL.
     */
    getAt(i=-1){
        //TODO
        return i === -1 ? this._itemstore.getItems() : this._itemstore.get(i);
    }

    /**
     * get all my items.
     */
    getAllItems(){
        let items = this._itemstore.getItems();
        return items;
    }


    /**
     * fetch from API, then prep the fetched information into "items".
     * @return the Promise of an array of prepped "items" that can be stored in items store.

     * @private
     */
    async _prepItems(n, starting=0){
        //TO BE OVERLOADED BY SUBCLASSES
    }

    /**
     * TODO append the given items into items store.
     */
    stockUp(newItems){
        const _ = this;
        _._itemstore.append(newItems);
    }

    /**
     * remove the item at index i.
     * @param i
     * @param hard: Boolean. if hard, the length of itemstore will also change(DONT DO THIS!).
     */
    remove(i, hard = false){
        //TODO
        if(hard)
            this._itemstore.remove(i);
        else
            this._itemstore.swap(i, undefined);
    }

    /**
     * swap the item at index i with a new item.
     * @param i
     * @param newItem
     */
    swap(i, newItem){
        //TODO
        this._itemstore.swap(i, newItem);
    }

    /**
     * update the item at index i.
     * @param customEndpoint
     * @param customTails additional fields to append to the query string( after customEndpoint)
     * @param i
     * @return promise of updated manager.
     */
    update(i, customEndpoint, ...customTails){
        //TODO
        const _ = this,
            id = this._itemIDstore.get(i);

        let queryString = customEndpoint
            ? customEndpoint
            : "cluster";

        if(customTails.length < 1)
            queryString += ("/" + id.id);
        else
            customTails.map(tail => queryString += `/${tail}`)
        P2("313 manager update: ", queryString)
        return _._q(queryString)
            .then(val => _._prepItems(1, i)
                                .then(obj => {
                                    _._itemstore.swap(i, obj[0]);
                                    print3("327, swapping with: ", obj[0]);
                                    return _;
                                })
            )

        // return _.fetchOne(i, customEndpoint)
        //     .then(newItem => {
        //         _._itemstore.swap(i, newItem);
        //     })
    }

    /**
     * turn an id into a queryable string. e.g. 46905 -> /cluster/46905
     * @param id
     * @param which 0 or 1, which endpoint to use.
     */
    _idtoQueryString(id, which, customEndpoint){
        //TODO
        let endpoint = customEndpoint
            ? customEndpoint
            : this._endpoints[which];
        let queryString = `${endpoint}/${id}`;

        return queryString;
    }

    /**
     * stock up the ID store.
     * @param queryString: e.g. /clusters/, or /unclusteredsentences
     * @return {Promise<void>}
     */
    async _initiateIDStore(queryString){
        //TODO
        const _  = this;
        return _._q(queryString)
            .then(arr => {
                _._itemIDstore.setItems(arr);
                print("store 155: ID STORE INITIATED: ", _._itemIDstore);
            })
    }


    /**
     * stock up the item store by fetching all items.
     * @param n fetch how many? default to 13.
     * @return {Promise<void>}
     * @private
     */
    async _initiateItemStore(n= 3){
        const _ = this;
        let itemsPromise = _._prepItems(n);
        return itemsPromise.then( items => _._itemstore.setItems(items));
    }

    /**
     * fetch one item (whose ID is at index i of ID store) from the API
     * @param which: 0 or 1. Which endpoint to use. e.g. /cluster/46904 is not the same as /clusterfeedbacks/46904
     * @param i index of item ID
     * @return {Promise<void>}
     */
    async fetchOne(i, which=0, customEndpoint=undefined){
        const _ = this;
        let IDObject = _._itemIDstore.get(i);
        if(!IDObject) return;
        let id = IDObject.id;
        let queryString = _._idtoQueryString(id, which, customEndpoint);
        return _._q(queryString);
    }

    /**
     * fetch N items(i.e all IDs in ID store) from the API.
     * @param which: 0 or 1
     * @param n: how many to fetch.
     * @param starting Number starting index
     * @return {Promise<Awaited<unknown>[]>}
     */
    async fetchN(n, which, customEndpoint, starting=0){
        const _ = this;

        let promises = [];
        for(let i = 0; i < n; i++)
            promises.push(_.fetchOne(starting+i, which, customEndpoint));

        return Promise.all(promises);
    }


    async fetchAll() {
        let count = this._itemIDstore.count();
        return fetchN(count);
    }

    /**
     * TODO the ID store should just store the IDs as numbers, not
     * objects with a field called id...
     * get the ID of the item at index
     * @param index
     */
    getID(index)
    {
        return this._itemIDstore.get(index).id;
    }

    setID(index, newID)
    {
        this._itemIDstore.setAt(index, newID);
    }

    setItem(index, newItem)
    {
        this.itemstore.setAt(index, newItem);
    }
}

/**
 * A "CLUSTER" ITEM is defined as ONE cluster ID, AND a LIST of associated feedback entries.
 */
class ClustersManager extends SectionItemManager {
    constructor(...args) {
        super(...args);

    }



    /**
     * fetch from API, then prep the fetched information into "items".
     * @param n: how many to fetch.
     * @return the Promise of an array of prepped "items" that can be stored in items store.

     * @private
     */
    async _prepItems(n, starting=0){
        const _ = this;
        let clustersPromise = this.fetchN(n, 0, "cluster", starting);
        let feedbacksPromise = this.fetchN(n, 1, "clusterfeedbacks", starting);
        return Promise.all([clustersPromise, feedbacksPromise])
            .then(values => _._buildObjects(values));
    }

    /**
     *
     * @param arr Array [clusters[], feedbacks[]]
     * @private
     */
    _buildObjects(arr){
        const _ = this;
        let items = [];
        let count = arr[0].length;
        for(let i = 0; i < count; i++){
            let cluster = arr[0][i][0],
                feedbacks = this._processFB(arr[1][i].filter(fb => fb)); //because some feedbacks are null.
            if(!cluster ) continue;
            items.push(_._buildObject(cluster, feedbacks));
        }

        return items;
    }

    /**
     *
     * @param cluster
     * @param feedbacks
     * @return {{feedbacks, accepted: *, id, title: (string|string|*)}}
     * @private
     */
    _buildObject(cluster, feedbacks){
        let item = {
            title: cluster.title,
            feedbacks: feedbacks,
            accepted: cluster.accepted,
            id: cluster.id
        }

        return item;
    }

    /**
     * TODO: a little ugly
     * (the text format is "text$fbid") seperate
     * the text and feedbackid. return an array
     * @return Array [text, ID]
     */
    _processFB(rawFB) {
        //TODO

        return rawFB.map(rawText => {
            if(!rawText) return [undefined, undefined];
            var rawArr = rawText.split('');
            var index = rawArr.lastIndexOf('$');

            let text = rawArr.splice(0, index);
            rawArr.shift();
            let fbID = Number(rawArr.join(''));
            // print("fbID: ", fbID);
            return [text.join(''), fbID];
        })

    }

}

/**
 * A "SENTENCE" ITEM is defined as an unclusterd sentence.
 */
class SentencesManager extends SectionItemManager {
    constructor(...args) {
        super(...args);
    }

    async _prepItems(n, starting=0){
        const _ = this;
        let itemPromises = _.fetchN(n,1, undefined,starting);
        return itemPromises.then(items => items.map(item => item[0]));
    }

    /**
     * fetch one ID object, then load that into item id store.
     * NOTE that both the ID and item store MUST be updated,
     * to keep the alignment. To update the item store, manually
     * call after ID is loaded.
     * @param ID
     * @param toEnd Boolean. If true, append new stuff to end, (else to the front)
     * @param customEndpoint
     * @return {Promise<void>}
     */
    async fetchOneID(ID, customEndpoint, toEnd=true){
        const _ = this;
        let queryString = customEndpoint
            ? customEndpoint
            : "sentence";
        queryString += ("/"+ID);
        // print2("FETCHING ONE SENTENCE ID: ", queryString);
        return _._q(queryString)
                .then(obj => {
                    obj = obj[0]
                    if(toEnd)
                        _._itemIDstore.append([obj]);
                    return _;
                })
    }


}

/**
 * return _._prepItems(1, _._itemIDstore.count()-1)
 *                         .then(items => {
 *                             _._itemstore.append(items);
 *                             return _;
 *                         })
 */

// test_isValid(new SectionItemManager()._isValidIndex)