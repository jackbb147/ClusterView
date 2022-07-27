// ==================== CONSTANTS ====================
const searchBarClassName = "searchBar"; //TODO: refactor this in section class itself
// --------------------------------------
const clustersBoxClassName = "clusters-box";    //TODO  refactoring
const sentencesBoxClassName = "unclusteredSentencesWrapper"; //TODO refactoring
const clusterEndpoint = "clusters";
const clusterFeedbacksEndpoint = "clusterfeedbacks";
const unclusteredSentencesEndpoint = "unclusteredsentences";
const sentenceEndpoint = "sentence";
const sentenceClassName = "unclustered-sentence";

const acceptedClassName = "accepted";
const unacceptedClassName = "unaccepted";
const sectionEndpoints = [
    [clusterEndpoint, clusterFeedbacksEndpoint],
    [unclusteredSentencesEndpoint, sentenceEndpoint]
];
const INITIALLOADCOUNT_SENTENCE = 20;
const INITIALLOADCOUNT_CLUSTER = 3;
