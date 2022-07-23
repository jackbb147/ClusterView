'use strict';


class SectionHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"col-12 section_head"}>
                <div className={"container_fluid"}>
                    <div>{this.props.title}</div>
                    <div className="searchBar">Search</div>
                </div>
            </div>
        )
    }
}

class ClustersBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="col col-10 hideScrollBar clusters-box">
                {this.props.children}
            </div>
        )
    }
}

class ClusterCardHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render( ) {
        return (
            <div className={"row ClusterCard_head"}>
                <div className={"col ClusterCard_title"}>{this.props.title}</div>
                <div className={"ClusterCard_close"}>X</div>
            </div>
        )
    }
}

class ClusterCardFeedbackEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    render( ) {
        return (
            <div className={"row ClusterCard_feedback"}>
                <div className={"feedback_entry"}>{this.props.text}</div>
                <div className={"feedback_remove"}>X</div>
            </div>
        )
    }
}

class ClusterCardBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render( ) {
        var i = 0;
        return (
            <div className={"row ClusterCard_body hideScrollBar"}>
                <div className={"container_fluid ClusterCard_body_container hideScrollBar"}>
                    {
                        this.props.feedbacks.map(fb =>
                            <ClusterCardFeedbackEntry key={i++} text={fb}></ClusterCardFeedbackEntry>
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



    render() {
        let display = this.props.display ? "" : "dontdisplay"
        return (
            <div className={`ClusterCard ${display}`}>
                <div className={"container_fluid"}>
                    <ClusterCardHead title={this.props.title}></ClusterCardHead>
                    <ClusterCardBody feedbacks={this.props.feedbacks}></ClusterCardBody>
                </div>
            </div>
        );
    }
}

class ClusterWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"container_fluid clustersWrapper"}>
                <div className="row">
                    <LeftBtn></LeftBtn>
                    <ClustersBox>{this.props.children}</ClustersBox>
                    <RightBtn></RightBtn>
                </div>
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
        var current = document.querySelector(".ClusterCard:not(.dontdisplay)")
        var prev = current.previousElementSibling;
        if(prev=== null) return;
        removeClass(prev, "dontdisplay");
        addClass(current, "dontdisplay");
    }

    render() {
        return (
            <div onClick={this.handleClick} className={"d-lg-none col col-1 leftBtn"}> {"<"} </div>
        )
    }
}

class RightBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(){
        print("clicked me ");
        var current = document.querySelector(".ClusterCard:not(.dontdisplay)")
        var next = current.nextElementSibling;
        if(next === null) return;
        removeClass(next, "dontdisplay");
        addClass(current, "dontdisplay");
    }

    render() {
        return (
            <div onClick={this.handleClick} className={"d-lg-none col col-1 rightBtn"}> {">"} </div>
        )
    }
}
/**
 * The clusters view
 */
class Section1 extends React.Component {
    constructor(props) {
        super(props);
        this._clusterStore = undefined;
        this.state = {
            loadedCards: [] //loaded cluster cards
        }
    }

    /**
     *
     * @param clusterID
     * @return
     * @private
     */
    async buildCluster(clusterID){
        const q = this.props.q;
        const cluster = q(`cluster/${clusterID}`);
        const feedbacks = q(`clusterfeedbacks/${clusterID}`);
        return Promise.all([cluster, feedbacks]).then(values => {
            const  cluster = values[0][0], feedbacks = values[1];
            return {
                title: cluster.title,
                feedbacks
            }
        })
    }

    /**
     * GET AN ARRAY OF ALL CLUSTER ID's
     * @return {Promise<*>}
     */
    async _loadClusterIDs(){
        return this.props.q("clusters");
    }

    /**
     * INITIATE A CLUSTER STORE AND RETURN IT
     * @return {Promise<Store>}
     * @private
     */
    async _initiateClusterStore(){
        const _ = this;
        var clusterIDs = this._loadClusterIDs();
        return clusterIDs.then(arr => {
            return new Store(arr);
        })
    }

    componentDidMount(){
        const _ = this;
        const q = this.props.q;
        print("I(SECTION1) MOUNTED!");
        _._initiateClusterStore()
            .then(store => {
                _._clusterStore = store;
                // print(store.getAll());
                _.loadClusterCards(5)

            })
    }

    async loadClusterCards(n){
        const _ = this;
        const bunch = _._clusterStore.getSome(n);
        var cardPromises = [];
        bunch.forEach(cluster => {
            cardPromises.push(_.buildCluster(cluster.id));
        })

        Promise.all(cardPromises).then( vals => {
            print("139: ", vals);
            _.setState({
                loadedCards: vals
            })
        })
    }


    render(){
        return (
            <div className={"row main_section1"}>
                <SectionHead title="All Clusters"></SectionHead>
                <SectionBody>
                    <ClusterWrapper>
                        {this.state.loadedCards.map((cardInfo, i) =>

                                <ClusterCard key={i}
                                             title={cardInfo.title}
                                             feedbacks={cardInfo.feedbacks}
                                             display={i < 1}
                                >
                                </ClusterCard>

                        )}
                    </ClusterWrapper>
                </SectionBody>
            </div>
        )
    }
}

class UnclusteredSentence extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"row unclustered-sentence"}>{this.props.text}</div>
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
    }

    render(){
        return (
            <div className={"container_fluid unclusteredSentencesWrapper hideScrollBar"}></div>
        )
    }
}

/**
 * The unclustered sentences view
 */
class Section2 extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div className={"row main_section2"}>
                <SectionHead title="Unclustered Sentences"></SectionHead>
                <SectionBody>
                    <UnclusteredSentencesWrapper></UnclusteredSentencesWrapper>
                </SectionBody>
            </div>
        )
    }
}

class App extends React.Component {
    /**
     *
     * @param props {q: query }
     */
    constructor(props) {
        super(props);
    }

    render() {
        return   (
            <div className={"container main"}>
                <Section1 q={this.props.q}></Section1>
                <Section2></Section2>
            </div>
        )
    }
}

async function q(endpoint, params={}){
    return fetch(`http://localhost:1700/api/${endpoint}`, params)
        .then(res => res.json())
        .then(val => {
            return val;
        })
}
const domContainer = document.querySelector('.AppContainer');
const root = ReactDOM.createRoot(domContainer);
root.render(<App q={q}></App>);