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
     * get n items, (optionally)skipping a few.
     * @param n
     * @param skip how many to skip
     */
    getSome(n, skip){
        if(skip === undefined) skip = 0;
        var ans = [];
        for(var i = 0; i < n && (i + skip) < this.count(); i++) ans.push(this.items[i + skip]);
        return ans;
    }
}