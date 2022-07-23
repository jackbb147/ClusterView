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
    constructor() {
        super();
    }

    render(){
        return (
            <div className="col col-10 hideScrollBar clusters-box">

            </div>
        )
    }
}

class ClusterCard extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>

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
                    <div className={"d-lg-none col col-1 leftBtn"}></div>
                    <ClustersBox></ClustersBox>
                    <div className={"d-lg-none col col-1 rightBtn"}></div>
                </div>
            </div>
        )
    }
}



/**
 * The clusters view
 */
class Section1 extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const q = this.props.q;
        print("I(SECTION1) MOUNTED!");
        q("cluster/46914").then(value => {
            print(value);
        })
    }


    render(){
        return (
            <div className={"row main_section1"}>
                <SectionHead title="All Clusters"></SectionHead>
                <SectionBody>
                    <ClusterWrapper></ClusterWrapper>
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