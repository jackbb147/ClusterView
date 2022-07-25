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
        print2("appendding the following into store: ", arr);

        this.items.push(...arr);
    }

    get last(){
        return this.items[this.items.length-1];
    }

    setItems(arr){
        this.items = arr;
    }

    clear(){
        this.items = [];
    }

    /**
     * swap the i-th item with the given newItem.
     * @param i index.
     * @param newItem
     */
    swap(i, newItem){
        //TODO
        print2("NEW ITEM: ", newItem)
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

    isEmpty(){
        return this.items.length < 1;
    }
}

