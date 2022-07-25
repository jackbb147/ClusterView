
let assert = console.assert;
function test_isValid(f){
    let cases = [
        {
            filter: 0,
            accepted: 1,
            answer: true
        },
        {
            filter: 1,
            accepted: 1,
            answer: true
        },
        {
            filter: 2,
            accepted: 1,
            answer: false
        },
        {
            filter: 2,
            accepted: false,
            answer: true
        }
    ]

    cases.map(testCase => {
        console.assert(f(testCase.filter, testCase.accepted) === testCase.answer)
    })
}