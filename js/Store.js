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

    setAt(i, item)
    {
        this.items[i] = item;
    }
    remove(i){
        //TODO
        if(!this.isValidIndex(i)) return;
        this.items.splice(i, 1);
    }

    removeItem(item){
        //TODO
        let existingitems = new Set(this.items);
        if(existingitems.has(item)){
            print2("STORE: YOU ARE CLEARING: ", item)
            existingitems.delete(item);
        }
        this.items = Array.from(existingitems);
    }

    isEmpty(){
        return this.items.length < 1;
    }

    notEmpty(){
        return !this.isEmpty();
    }
}

/**
 * manages a list of items, but no duplicates allowed.
 */
class NoDuplicateStore extends Store{
    constructor(){
        super();
        this.items = [];
    }

    /**
     * append some new items into the end of my items.
     * @param arr new items.
     */
    append(arr){
        const _ =this;
        // print2("i am a noduplicate store! You are appending: ", arr)
        let existingItems = new Set(_.items);
        let filteredArr = arr.filter(el => !existingItems.has(el));
        super.append(filteredArr);
        //TODO find the duplicate ones, before appending .
    }

    setItems(arr){
        let _ = this;
        if(arr === undefined) return;
        _.items = [];
        arr.forEach(item => {
            _.append([item])
        })
    }

}


