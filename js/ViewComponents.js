
// ==================== VIEW COMPONENTS ====================
class SearchBar extends React.Component {
    /**
     * this.props.cb: callback function for search btn
     * this.props.i: 1 or 2 (identifier used for classname)

     */
    constructor(props) {
        super(props);
    }

    /**
     * after pressing search, the clear button appears.
     * After clearing, the clear button disappears.
     * @private
     */
    _onSearch(){
        //TODO
        var clearBtn = document.querySelector(`.searchBar-${this.props.i} >.searchBar_clear`)
        if(clearBtn.classList.contains("no-display")){
            clearBtn.classList.remove("no-display");
        }
        this.props.cb();
    }

    _onClear(){
        //TODO
        var clearBtn = document.querySelector(`.searchBar-${this.props.i} >.searchBar_clear`);
        clearBtn.classList.add("no-display");
        this.props.cbClear();
    }
    render(){
        return (
            <div className={`${searchBarClassName} ${searchBarClassName}-${this.props.i}`}>
                <div className={"searchBar_input"}>
                    <input type="text"/>
                </div>
                <div className={"searchBar_btn btn"} onClick={this._onSearch.bind(this)}>Search</div>
                <div className={"searchBar_clear no-display"} onClick={this._onClear.bind(this)}>Clear</div>
            </div>
        )
    }
}


// ----------- SECTION 1 ----------------

class SectionHead extends React.Component {
    /**
     * this.props.cb: callback function passed to search btn.
     * @param props
     */
    constructor(props) {
        super(props);
    }

    render(){

        return (
            <div className={"col-12 section_head"}>
                <div className={"container_fluid"}>
                    <div
                        className={
                            (this.props.filterCB?"filterBtn btn btn-primary":"")
                        }

                        onClick={this.props.filterCB}

                    >
                        {this.props.title}
                    </div>
                    <SearchBar i={this.props.i} cb={this.props.cb} cbClear={this.props.cbClear}></SearchBar>
                </div>
            </div>
        )
    }
}

class ClustersBox extends React.Component {
    constructor(props) {
        super(props);
        this.classname = clustersBoxClassName;

    }


    render(){
        const _ = this;
        let filter = this.props.filter;

        return (
            <div onScroll={_.props.scrollcb ? _.props.scrollcb.bind(_) : ()=>{}} className="col col-10 hideScrollBar clusters-box">
                {this.props.children}
            </div>
        )
    }
}


class ClusterCardHead extends React.Component {
    constructor(props) {
        super(props);
    }

    _onPick(){
        const _ =this


        function f(){
            if(!_.props.picking) return;
            P("111: you picked me. see console", _.props.id, _.props.index)
            let id = _.props.id,
                index = _.props.index;
            this.props.onReceiveSentences(id, index)
            print2(this);
        }

        return f.bind(this )
    }

    render( ) {
        const _ = this;
        let picking = false;
        if(this.props.picking === true) picking = true;

        return (
            <div className={"row ClusterCard_head"}>
                <div
                    className={`col ClusterCard_title ` + (picking ? "btn btn-primary" : "")}
                    onClick={_._onPick()}
                >
                    {this.props.title}
                </div>
                {/*<div className={"ClusterCard_close"}>X</div>*/}
                <SetAcceptedStatusBtn
                    accepted={this.props.accepted}
                    id={this.props.id}
                    cb={this.props.cb}
                    index={this.props.index}
                />
            </div>
        )
    }
}

class ClusterCardFeedbackEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * callback for remove feedback
     */
    onRemove(){
        print2("you remove me! ", this);
        this.props.onRemoveFeedbackEntry(
            this.props.id,
            this.props.index
        );
        //TODO
    }


    processText(text)
    {

        //TODO
        print3(this.props.sentenceLen, this.props.sentenceStart)
        let sentenceLen = this.props.sentenceLen, startIndex = this.props.sentenceStart;
        let arr = text.split("");
        arr.splice(startIndex, 0, `<mark>`);//${sentenceLen},${startIndex}
        arr.splice(startIndex+sentenceLen+1, 0, `</mark>`)
        return {
            __html: `<p>${arr.join("")}</p>` // + startIndex + "," + sentenceLen
        }
        // let temp = document.createElement("div")
        // temp.innerHTML = `<p>${text}</p>`
        // return temp;
    }

    render() {
        var text = this.processText(this.props.text)
        return (
            <div className={"row ClusterCard_feedback"}>
                <div
                    className={"feedback_entry"}
                    dangerouslySetInnerHTML={text}
                >

                </div>
                <div onClick={this.onRemove.bind(this)} className={"feedback_remove btn"}>remove</div>
            </div>
        )
    }
}

class ClusterCardBody extends React.Component {
    constructor(props) {
        super(props);
    }


    onRemoveFeedbackEntry(){
        function f(sentenceID, sentenceIndex){
            this.props.onRemoveFeedbackEntry(
                sentenceID, sentenceIndex
            );
        }

        return f.bind(this)
    }

    render( ) {
        const _ = this;
        // print("735: ", this.props);
        var i = 0;
        return (
            <div className={"row ClusterCard_body hideScrollBar"}>
                <div className={"container_fluid ClusterCard_body_container hideScrollBar"}>
                    {
                        this.props.feedbacks.map(fb =>{
                                return <ClusterCardFeedbackEntry
                                    key={i}
                                    text={fb[0]}
                                    id={fb[1]} //sentenceID
                                    sentenceLen={fb[2]}
                                    sentenceStart={fb[3]}
                                    clusterID={this.props.clusterID}
                                    onRemoveFeedbackEntry={this.onRemoveFeedbackEntry()}
                                    index={i++}
                                    clusterIndex={this.props.clusterIndex}
                                />
                                // let textNid = _._processText(fb);
                                // if(!(textNid[1] === undefined))


                            }
                        )
                    }
                </div>
            </div>
        )
    }
}

class ClusterCard extends React.Component {
    /**
     *
     * @param props {title, feedbacks}
     */
    constructor(props) {
        super(props);

    }


    onReceiveSentences(){
        const _ = this;
        function f(clusterID, clusterIndex){
            P("230 YOU CLICKED ME SEE CONSOLE", clusterID, clusterIndex)
            print2(this)
            _.props.onReceiveSentences(clusterID, clusterIndex);

        }

        return f.bind(this);
    }
    onRemoveFeedbackEntry(){
        const _ = this;
        print("YOU REMOVE ME! I AM: ", _);


        function f(sentenceID){
            //clusterID, sentenceID, itemIndex
            _.props.onRemoveFeedbackEntry(
                _.props.id,
                sentenceID,
                _.props.index
            )
        }

        return f.bind(this);
    }
    render() {
        let accepted = this.props.accepted;
        let display = this.props.display ? "" : "no-display-until-lg"

        return (
            <div
                className={`ClusterCard ${display} ${accepted ? acceptedClassName : unacceptedClassName}`}>
                <div className={"container_fluid"}>
                    <ClusterCardHead
                        index={this.props.index}
                        cb={this.props.headCB}
                        id={this.props.id}
                        accepted={this.props.accepted}
                        title={this.props.title}
                        giveMe={this.props.giveMe}
                        picking={this.props.picking}
                        onReceiveSentences={this.onReceiveSentences()}
                    />
                    <ClusterCardBody
                        feedbacks={this.props.feedbacks}
                        onRemoveFeedbackEntry={this.onRemoveFeedbackEntry()}
                        clusterID={this.props.id}
                        clusterIndex={this.props.index}

                    />

                </div>
                <div className={"addSentenceToMe"}></div>
            </div>
        );
    }
}

class ClusterWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const _ = this;
        return (
            <div  className={"container_fluid clustersWrapper"}>
                <div className="row" >
                    <LeftBtn cb={this.props.leftBtnClick}></LeftBtn>
                    <ClustersBox filter={this.props.filter} filterCB={this.props.filterCB} scrollcb={_.props.scrollcb}>{this.props.children}</ClustersBox>
                    <RightBtn cb={this.props.rightBtnClick}></RightBtn>
                </div>
            </div>
        )
    }
}














class SetAcceptedStatusBtn extends React.Component{
    constructor(props) {
        super(props);
        if(!this.props.accepted) {
            this.className = "ClusterCard_accept-btn "
            this.text = "accept"
        }

    }

    _handleClick(){
        print("you clicked me ")
        print("323: button clicked",this.props.accepted , this.props.id);
        this.props.cb(this.props.accepted, this.props.id, this.props.index)
    }

    render(){

        var className = this.props.accepted ?
            'ClusterCard_unaccept-btn' : "ClusterCard_accept-btn";
        var text = this.props.accepted ? 'unaccept':'accept';
        return (
            <div
                onClick={this._handleClick.bind(this)}
                className={className + " btn" }>
                {text}
            </div>
        )
    }
}

class LeftBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(){
        print("clicked me ");
        this.props.cb();
        // var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        // if(current === null) return;
        // var prev = current.previousElementSibling;
        // if(prev=== null) return;
        // removeClass(prev, "no-display-until-lg");
        // addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div  className={"d-lg-none col col-1 leftBtn btn"}>
                <div onClick={this.handleClick.bind(this)}>{"<"}</div>
            </div>
        )
    }
}

class RightBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(){
        print("clicked me ");
        this.props.cb();
        // var current = document.querySelector(".ClusterCard:not(.no-display-until-lg)")
        // if(current === null) return;
        // var next = current.nextElementSibling;
        // if(next === null) return;
        // removeClass(next, "no-display-until-lg");
        // addClass(current, "no-display-until-lg");

    }

    render() {
        return (
            <div  className={"d-lg-none col col-1 rightBtn btn"}>
                <div onClick={this.handleClick.bind(this)}> {">"}</div>
            </div>
        )
    }
}





// ----------- SECTION 2 ----------------

class UnclusteredSentence extends React.Component {
    constructor(props) {
        super(props);
    }

    addToClusterCB(){
        const _ =this;
        function f(){
            P("405:  YOU CLICKED ME. SEE CONSOLE",)
            print2(this);
            let
                sentence_id = this.props.sentence_id,
                index = this.props.index;
            _.props.addToClusterCB(sentence_id, index);
        }

        return f.bind(this);
    }


    render(){
        // print("923: my props: ", this.props);
        return (
            <div className={"row unclustered-sentence"}>
                <div className={"col-8"}>{this.props.text}</div>
                <div className={"col-4 pickMeBtn"}
                     onClick={this.addToClusterCB()}>
                    PICK ME
                </div>
            </div>
        )
    }

}

class SectionBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"col-12 section_body"}>
                {this.props.children}
            </div>
        )
    }
}

class UnclusteredSentencesWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.classname = "unclusteredSentencesWrapper"
    }


    render(){
        const _ = this;
        return (
            <div
                onScroll={_.props.cb ? _.props.cb.bind(_) : ()=>{}}
                className={"container_fluid unclusteredSentencesWrapper hideScrollBar"}>
                {this.props.children}
            </div>
        )
    }
}

