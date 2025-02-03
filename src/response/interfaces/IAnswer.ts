import { QuestionType } from 'src/form/schemas/question.schema';

export interface IAnswer {
  _id: string;
  answerId: string;
  questionId: string;
  timeLeft: number;
  optionIds?: string[];
  optionId?: string;
  booleanQuestion?: boolean;
  textResponse?: string;
  questionType: QuestionType;
  questionNumber: number;
  disabledResponse: boolean;
  answeredQuestion?: boolean;
  createdAt?: string;
  dateSubmitted?: string;
  correctResponse?: boolean;
  scoreForQuestion?: number;
}
