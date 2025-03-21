export interface MainQuestion{
    id : number;
    text:string;
}

export interface SubQuestion {
    question : string;
    options : string[];
    correctAnswer : string;
}

export interface SubQuestionResponse {
    suQuestions : SubQuestion[];
}