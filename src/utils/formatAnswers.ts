function convertAnswerArrayToObject(
    answerArray: Record<string, any>[],
): Record<string, any> {
    const answerObj: Record<string, any> = {};
    answerArray.forEach(answerArrayObj => {
        Object.entries(answerArrayObj).forEach(([key, value]) => {
            if (value.length === 0) {
                answerObj[key] = '';
            } else if (Object.hasOwn(value[0], '#text')) {
                answerObj[key] = value[0]['#text'];
            } else if (Array.isArray(value)) {
                answerObj[key] = convertAnswerArrayToObject(value);
            }
        });
    });
    return answerObj;
}

export function formatFormAnswers(formAnswer: {
    answer: string;
    answerSorted?: string;
    [key: string]: any;
}): Record<string, any> {
    const answerData =
        formAnswer.answerSorted && formAnswer.answerSorted !== '{}'
            ? formAnswer.answerSorted
            : formAnswer.answer;
    let answers: Record<string, any> | Record<string, any>[] =
        JSON.parse(answerData);
    if (Array.isArray(answers)) {
        const answerObj = convertAnswerArrayToObject(answers);
        answers = answerObj;
    }
    return answers?.data || {};
}
