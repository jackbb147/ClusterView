/**
 * manages a list of items.
 */
class Store{
    constructor(queryString){
        this.items = [];
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
        return (i + 1 < this.items.length && 0 <= i)
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
 * Section1 has a(or multiple, for filtering) ClustersManager(s),
 * Section2 has a Sentences manager.
 */
class SectionItemManager {
    /**
     *
     * @param q
     * @param filter
     */
    constructor(q, endpoint, filter=undefined ) {
        this._itemstore = new Store();
        this._endpoint = endpoint; //e.g "/cluster/", or "/sentence"
        this._itemIDstore = new Store()
        this._filter = filter;
        this._q = q;
    }


    /**
     * call this to initiate the item manager.
     * @return {Promise<Awaited<*>[]>}
     * @private
     */
    async initiate(){
        const _ = this;
        let queryString = `${_._endpoint}` //TODO
        if(this._filter) queryString += `/${this._filter};`
        return _._initiateIDStore(queryString)
            .then(() => _._initiateItemStore());
    }

    /**
     * get the item at index i.
     * @param i if i is -1, get ALL.
     */
    get(i=-1){
        //TODO
        return i === -1 ? this._itemstore.getItems() : this._itemstore.get(i);
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
     */
    _idtoQueryString(id){
        //TODO
        return `${this._endpoint}/${id}`;
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
     * @return {Promise<Awaited<*>[]>}
     */
    async _initiateItemStore(n= 10){
        const _ = this;
        let itemsPromise = this.fetchN(n);

        return itemsPromise.then( items => {
          _._itemstore.setItems(items);
        })
    }

    /**
     * fetch one item (whose ID is at index i of ID store) from the API
     * @return {Promise<void>}
     */
    async fetchOne(i){
        const _ = this;
        let id = _._itemIDstore.get(i).id;
        let queryString = _._idtoQueryString(id);
        print("177: ", id);
        print("178: ", queryString);
        return _._q(queryString);
    }

    /**
     * fetch N items(i.e all IDs in ID store) from the API.
     * @return {Promise<Awaited<unknown>[]>}
     */
    async fetchN(n){
        const _ = this;

        let promises = [];
        for(let i = 0; i < n; i++)
            promises.push(_.fetchOne(i));

        return Promise.all(promises);
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
        this._activeindex = 0;
    }

    getActiveIndex(){
        return this._activeindex;
    }

    incrementIndex(){
        let count = _._itemstore.count();
        if(this._activeindex + 1 < count) this._activeindex++;
    }

    decrementCount(){
        let count = _._itemstore.count();
        if(this._activeindex - 1 >= 0) this._activeindex--;
    }

}

/**
 * A "SENTENCE" ITEM is defined as an unclusterd sentence.
 */
class SentencesManager extends SectionItemManager {
    constructor(...args) {
        super(...args);
    }

}

