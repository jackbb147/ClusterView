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
        // console.trace();
        // print("append called: ", arr);
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

