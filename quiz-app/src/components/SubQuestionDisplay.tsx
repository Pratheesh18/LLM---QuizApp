import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import { SubQuestion } from '../types';

interface SubQuestionDisplayProps {
  selectedQuestion: string | null;
  subQuestions: SubQuestion[] | null;
  loading: boolean;
  error: string | null;
}

const SubQuestionDisplay: React.FC<SubQuestionDisplayProps> = ({
  selectedQuestion,
  subQuestions,
  loading,
  error,
}) => {
  if (!selectedQuestion) return null;

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardHeader title={`Subquestions for: ${selectedQuestion}`} />
      <CardContent>
        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        {subQuestions && (
          <List>
            {subQuestions.map((sub, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {sub.question}
                </Typography>
                <List disablePadding>
                  {sub.options.map((option, optIndex) => (
                    <ListItemText
                      key={optIndex}
                      primary={option}
                      sx={{
                        color: option[0] === sub.correctAnswer ? 'green' : 'inherit',
                      }}
                    />
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default SubQuestionDisplay;