import React from 'react';
import { Result } from '../../../types/Result.ts';

interface Step4Props {
    showStep: (step: number) => void;
    results: Result[];
    nb: number;
    score: number;
}

const Step4: React.FC<Step4Props> = ({ showStep, results, nb, score }) => {
    console.log(results);
    return (
        <div>
            <h2>Résultats</h2>
            <p>Vous avez terminé le quiz (avec {results.length} questions terminées sur {nb}). Votre score
                est {score}/{nb}.
            </p>
            <p>
                Voici le détail de vos réponses :
            </p>
            <table>
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Question</th>
                    <th>Statut</th>
                    <th>Options sélectionnées</th>
                    <th>Réponses correctes</th>
                </tr>
                </thead>
                <tbody>
                {results.map((result, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{result.question}</td>
                        <td>{result.correct ? "Correct" : result.partial ? "Partiellement correct" : "Incorrect"}</td>
                        <td>{result.selectedOptions.join(', ')}</td>
                        <td>{result.correctAnswers.join(', ')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => showStep(1)}>Recommencer</button>
        </div>
    );
}

export default Step4;