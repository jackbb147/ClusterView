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

class Section1Body extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div className={"col-12 section_body"}>
                <div className={"container_fluid clustersWrapper"}>
                    <div className="row">
                        <div className={"d-lg-none col col-1 leftBtn"}></div>
                        <ClustersBox></ClustersBox>
                        <div className={"d-lg-none col col-1 rightBtn"}></div>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * The clusters view
 */
class Section1 extends React.Component {
    constructor() {
        super();
    }


    render(){
        return (
            <div className={"row main_section1"}>
                <SectionHead title="All Clusters"></SectionHead>
                <Section1Body></Section1Body>
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

class Section2Body extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={"col-12 section_body"}>
                <div className={"container_fluid unclusteredSentencesWrapper hideScrollBar"}></div>
            </div>
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
                <Section2Body></Section2Body>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return 'You liked this.';
        }

        return   (
            <div className={"container main"}>
                <Section1></Section1>
                <Section2></Section2>
            </div>
        )
    }
}

const domContainer = document.querySelector('.AppContainer');
const root = ReactDOM.createRoot(domContainer);
root.render(<App></App>);