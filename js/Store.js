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

    /**
     * count how many items there are in the store.
     * @return Number
     */
    count(){
        return this.items.length;
    }


    add(...newItems){
        (this.items).push(...newItems);
    }

    remove(identifier){
        //TODO
    }

    getAll(){
        return this.items;
    }

    /**
     * get n items out of the store, (optionally)skipping a few.
     *
     * @param n if -1, get all.
     * @param skip how many to skip
     */
    getSome(n, skip){
        print("GET SOME() CALLED, STORE", this.items);
        if(n < 0) return this.getAll()
        if(this.count() < 1) return [];
        if(skip === undefined) skip = 0;
        var ans = [];
        for(var i = 0; i < n && (i + skip) < this.count(); i++) ans.push(this.items.shift());
        return ans;
    }
}

/**
 * just like store, but keeps track of an index property, and can LOAD from API.
 */
class SuperStore extends Store{
    /**
     *
     * @param arr
     * @param q query function
     */
    constructor(arr, q) {
        super(arr);
        this._q = q;
        this._activeIndex = 0;
        this._loadedItems = [];
    }

    incrementIndex(){
        //TODO
        var i = this._activeIndex;
        if((i+1) < this.length()) this._activeIndex++;
    }

    decrementIndex(){
        //TODO
        var i = this._activeIndex;
        if(i > 1) this._activeIndex--;
    }

    getActiveIndex(){
        return this._activeIndex;
    }

    /**
     * load one item .
     */
    loadItem(){

    }

    /**
     * load a bunch of items.
     */
    loadItems(){

    }

    getLoadedItems(){
        return this._loadedItems;
    }


}