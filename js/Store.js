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

    add(item){
        (this.items).push(item);
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