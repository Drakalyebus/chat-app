import Classifier from "clustex";

function isSpam(message = "") {
    const classifier = new Classifier([], 0.5, 0.8);
    classifier.dataset("spam", 1);
    return classifier.classify(message) === "spam";
}

export default isSpam;