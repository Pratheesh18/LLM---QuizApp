import React from "react";
import { Button,Card,CardContent,CardHeader,List,ListItem } from "@mui/material";
import { MainQuestion } from "../types";



interface QuestionListProps {
    questions : MainQuestion[];
    onQuestionClick : (question:string) => void;
}

const QuestionList : React.FC <QuestionListProps> = ({questions,onQuestionClick}) => {
    return (
        <Card sx={{maxWidth:600,mx:'auto',mb:4}}>
            <CardHeader title="Main Questions" />
            <CardContent>
                <List>
                    {questions.map((q) => (
                        <ListItem key={q.id} disablePadding>
                            <Button variant="outlined" fullWidth sx={{justifyContent:'flex-start',textAlign:'left',py:1}} onClick={() => onQuestionClick(q.text)}>
                                {q.text}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
};

export default QuestionList;