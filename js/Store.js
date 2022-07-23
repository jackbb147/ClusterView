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
     * get the first n items. n must be <= number of items available.
     * @param n
     */
    getSome(n){
        var ans = [];
        for(var i = 0; i < n; i++) ans.push(this.items[i]);
        return ans;
    }
}