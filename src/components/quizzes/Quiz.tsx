import React, { useState } from 'react';
import { validateCSVFormat } from '../../utils/csvHandler.ts';
import { parseQuestionsAuto } from '../../utils/quizParsers.ts';
import Step1 from "./quizSteps/Step1.tsx";
import Step2 from "./quizSteps/Step2.tsx";
import Step3 from "./quizSteps/Step3.tsx";
import Step4 from "./quizSteps/Step4.tsx";
import './Quiz.css';
import { Question } from "../../types/Question.ts";
import { Result } from '../../types/Result.ts';
import QuestionNavToggle from './QuestionNavToggle.tsx';

interface QuizProps {
    step: number;
    showStep: (step: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ step, showStep }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [results, setResults] = useState<Result[]>([]);
    const [fileStatus, setFileStatus] = useState<string>('');
    const [errors, setErrors] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [score, setScore] = useState<number>(0);
    const [success, setSuccess] = useState<boolean>(false);
    const [submittedStates, setSubmittedStates] = useState<boolean[]>(Array(questions.length).fill(false));
    const [selectedOptions, setSelectedOptions] = useState<string[][]>(Array(questions.length).fill([]));
    const [correctResponsesText, setCorrectResponsesText] = useState<string>("");

    const resetState = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setResults([]);
        setFileStatus('');
        setErrors('');
        setFeedback('');
        setScore(0);
        setSubmittedStates(Array(questions.length).fill(false));
        setSelectedOptions(Array(questions.length).fill([]));
        setCorrectResponsesText("");
    };

    const handleFileImport = (file: File): boolean => {
        resetImportFeedback();
        if (!file) {
            alert('Veuillez sélectionner un fichier');
            setSuccess(false);
        }
        const reader = new FileReader();
        reader.onload = async function (event) {
            try {
                const text = event.target!.result as string;
                let questions: Question[];
                const lower = file.name.toLowerCase();
                if (lower.endsWith('.csv')) {
                    questions = validateCSVFormat(text);
                } else if (lower.endsWith('.json') || lower.endsWith('.yaml') || lower.endsWith('.yml')) {
                    questions = await parseQuestionsAuto(text, file.name);
                } else {
                    setFileStatus('✗ Extension de fichier incorrecte');
                    setSuccess(false);
                    return;
                }
                setQuestions(questions);
                setSuccess(true);
                showStep(2);
            } catch (error) {
                setErrors(`✗ ${(error as Error).message}`);
                setSuccess(false);
            }
        };
        reader.onerror = function () {
            setErrors('✗ Erreur lors de la lecture du fichier');
            setSuccess(false);
        };
        reader.readAsText(file);
        resetState();
        return success;
    };

    const resetImportFeedback = () => {
        setFileStatus('');
        setErrors('');
    };

    const showPreviousQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setFeedback('');
        resetCheckboxes();
    };

    const showNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setFeedback('');
        resetCheckboxes();
        setCorrectResponsesText("");
    };

    const resetCheckboxes = () => {
        const checkboxes = document.querySelectorAll('input[name="option"]');
        checkboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = false;
        });
    };

    const submitAnswer = () => {
        const selectedOptions = Array.from(document.querySelectorAll('input[name="option"]:checked'))
            .map((input) => (input as HTMLInputElement).value);
        if (selectedOptions.length === 0) {
            alert('Please select at least one option');
            return;
        }
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswers = currentQuestion.correctAnswers;
        const isCorrect = selectedOptions.every(option => correctAnswers.includes(option)) && selectedOptions.length === correctAnswers.length;
        const isPartial = selectedOptions.some(option => correctAnswers.includes(option)) && !isCorrect;

        setResults((prevResults: Result[]) => {
            const newResults = [...prevResults];
            newResults[currentQuestionIndex] = { question: currentQuestion.question, correct: isCorrect, partial: isPartial, selectedOptions, correctAnswers };
            return newResults;
        });

        let questionScore = 0;
        if (isCorrect) {
            questionScore = 1;
            setFeedback('Correct!');
        } else if (isPartial) {
            const correctCount = selectedOptions.filter(option => correctAnswers.includes(option)).length;
            const incorrectCount = selectedOptions.filter(option => !correctAnswers.includes(option)).length;
            questionScore = (correctCount / correctAnswers.length) - (incorrectCount * 0.25);
            setFeedback('Partiellement correct');
            setCorrectResponsesText("Réponses correctes : " + correctAnswers.join(', '));
        } else {
            questionScore = -0.5 * selectedOptions.length;
            setFeedback('Faux');
            setCorrectResponsesText("Réponses correctes : " + correctAnswers.join(', '));
        }

        questionScore = Math.max(questionScore, 0);
        setScore((prevScore) => prevScore + questionScore);

        setSubmittedStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[currentQuestionIndex] = true;
            return newStates;
        });

        setSelectedOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[currentQuestionIndex] = selectedOptions;
            return newOptions;
        });
    };

    const finish = () => {
        showStep(4);
    };

    return (
        <div className={"quiz-page"}>
            {step === 1 && <Step1 handleFileUpload={handleFileImport} fileStatus={fileStatus} showStep={showStep} errors={errors}/>}
            {step === 2 && <Step2 showStep={showStep} questions={questions}/>}
            {step === 3 && (
                <>
                    <Step3 showPreviousQuestion={showPreviousQuestion} showNextQuestion={showNextQuestion}
                           submitAnswer={submitAnswer} finish={finish} questions={questions}
                           currentQuestionIndex={currentQuestionIndex} feedback={feedback}
                           submittedStates={submittedStates} selectedOptions={selectedOptions}
                           correctResponsesText={correctResponsesText}
                    />
                    <div className="score">Score: {score}/{questions.length}</div>
                    <QuestionNavToggle
                        questions={questions}
                        setCurrentQuestionIndex={setCurrentQuestionIndex}
                        results={results}
                        currentQuestionIndex={currentQuestionIndex}
                    />
                </>
            )}
            {step === 4 && <Step4 showStep={showStep} results={results} nb={questions.length} score={score}/>}
        </div>
    );
}

export default Quiz;