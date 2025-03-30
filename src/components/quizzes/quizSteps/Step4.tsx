import React from 'react';
import { Result } from '../../../types/Result.ts';

interface Step4Props {
    showStep: (step: number) => void;
    results: Result[];
    nb: number;
    score: number;
}

const Step4: React.FC<Step4Props> = ({ showStep, results, nb, score }) => {
    return (
        <div>
            <h2>Résultats</h2>
            <p>Vous avez terminé le quiz (avec {results.length} questions terminées sur {nb}). Votre score est {score}/{nb}.
            </p>
            <p>
                Voici le détail de vos réponses :
            </p>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <h3>Question {index+1} : {result.question}</h3>
                        <p>{result.correct ? "Correct" : result.partial ? "Partiellement correct" : "Incorrect"}</p>
                        {!result.correct && <p>Options sélectionnées : {result.selectedOptions.join(', ')}</p>}
                        {!result.correct && <p>Réponses correctes : {result.correctAnswers.join(', ')}</p>}
                    </li>
                ))}
            </ul>
            <button onClick={() => showStep(1)}>Recommencer</button>
        </div>
    );
}

export default Step4;