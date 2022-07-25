/**
 * manages a list of items.
 */
class Store{
    constructor(){
        this.items = [];
    }

    /**
     * append some new items into the end of my items.
     * @param arr new items.
     */
    append(arr){
        this.items.push(...arr);
    }

    setItems(arr){
        this.items = arr;
    }

    /**
     * swap the i-th item with the given newItem.
     * @param i index.
     * @param newItem
     */
    swap(i, newItem){
        //TODO
        if(!this.isValidIndex(i)) return;
        this.items[i] = newItem;
    }

    isValidIndex(i){
        //TOOD
        return (i < this.items.length && 0 <= i)
    }

    getItems(){
        return this.items;
    }

    count(){
        return this.items.length;
    }

    get(i){
        return this.items[i];
    }

    remove(i){
        //TODO
        if(!this.isValidIndex(i)) return;
        this.items.splice(i, 1);
    }

}

/**
 * stores a list, where each item in the list is
 * the information needed to build that item for view.
 * TWO TYPES OF THINGS STORED:
 *      item id: e.g. cluster/46904, sentence/12389
 *      item: the actual item.
 *
 * TWO ENDPOINTS:
 *      first one is for:
 *      second one is for:
 *
 * Section1 has a(or multiple, for filtering) ClustersManager(s),
 * Section2 has a Sentences manager.
 */
class SectionItemManager {
    /**

     * @param q
     * @param filter
     */
    constructor(q, endpoints, filter=undefined ) {
        this._itemstore = new Store();
        this._endpoints = endpoints; //e.g "/cluster/", or "/sentence"
        this._itemIDstore = new Store()
        this._filter = filter;
        this._q = q;
        this._activeindex = 0;
    }


    /**
     * call this to initiate the item manager.
     * @return {Promise<Awaited<*>[]>}
     * @private
     */
    async initiate(){
        const _ = this;
        print("SectionItemManager: 86: ", _);
        let queryString = `${_._endpoints[0]}` //TODO

        if(this._filter) queryString += `/${this._filter};`
        return _._initiateIDStore(queryString)
            .then(() => _._initiateItemStore());
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

    getActiveIndex(){
        return this._activeindex;
    }

    setActiveIndex(i){
        if(!this._itemstore.isValidIndex(i)){
            print(i+" is not a valid index. ");
            return;
        }
            this._activeindex = i;
    }

    /**
     * NOTE: AUTOMATICALLY FETCH MORE FROM API, IF NEW INDEX IS OUT OF BOUNDS.
     * @param n
     */
    incrementIndex(n=1){
        const _ = this;
        let count = this._itemstore.count();
        if(this._activeindex + n < count) this._activeindex+=n;
        else {
            print("Store.js 140: incrementIndex called. Out of bounds. ")
            _.fetchN(n, 1)
                .then(items => {
                    _.stockUp(items);
                    print("152: finished stocking up: new items: ", _.getAllItems());
                })
        }
    }

    decrementIndex(n=1){
        let count = this._itemstore.count();
        if(this._activeindex - n >= 0) this._activeindex-=n;
    }

    /**
     * remove the item at index i.
     * @param i
     * @param hard: Boolean. if hard, the length of itemstore will also change.
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
     * @param i
     */
    update(i){
        //TODO
        const _ = this;
        _.fetchOne(i)
            .then(newItem => {
                _._itemstore.swap(i, newItem);
            })
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
     * @param n fetch how many? default to 10.
     * @return {Promise<void>}
     * @private
     */
    async _initiateItemStore(n= 10){
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

        let id = _._itemIDstore.get(i).id;
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

    /**
     * TODO load the given items into items store.
     */
    stockUp(newItems){
        // _._itemstore.add
        const _ = this;
        _._itemstore.append(newItems);
    }
    async fetchAll() {
        let count = this._itemIDstore.count();
        return fetchN(count);
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
     * @return the Promise of an array of prepped "items" that can be stored in items store.
     * @private
     */
    async _prepItems(n){
        const _ = this;
        let clustersPromise = this.fetchN(n, 0, "cluster");
        let feedbacksPromise = this.fetchN(n, 1);
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

    async _prepItems(n){
        print("section 2 prep called!");
        const _ = this;
        let itemPromises = _.fetchN(n,1);
        return itemPromises.then(items => items.map(item => item[0]));
    }

}

