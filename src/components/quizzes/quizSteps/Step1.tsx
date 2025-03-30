import React, { useState, useEffect } from 'react';

interface Step1Props {
    showStep: (step: number) => void;
    handleFileUpload: (file: File) => void;
    fileStatus: string;
    errors: string;
}

const Step1: React.FC<Step1Props> = ({ showStep, handleFileUpload, fileStatus, errors }) => {
    const [file, setFile] = useState<File | null>(null);
    const [dropMessage, setDropMessage] = useState<string>('');

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setDropMessage('Fichier sélectionné avec succès.');
        }
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleFileDrop = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
            setDropMessage('Fichier déposé avec succès.');
        }
    };

    const onSubmit = () => {
        if (file) {
            handleFileUpload(file);
            showStep(2);
        } else {
            alert('Veuillez sélectionner un fichier CSV.');
        }
    };

    useEffect(() => {
        const dropZone = document.querySelector('.drop-zone') as HTMLElement;
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleFileDrop);

        return () => {
            dropZone.removeEventListener('dragover', handleDragOver);
            dropZone.removeEventListener('drop', handleFileDrop);
        };
    }, []);

    return (
        <div>
            <h2>Étape 1: Chargez votre fichier CSV</h2>
            <p>Format attendu: question,option1,option2,option3,option4,réponses_correctes</p>
            <p>Note: Pour les réponses correctes multiples, séparez-les par des points-virgules</p>

            <div className="drop-zone" onClick={() => document.getElementById('csvFile')?.click()}>
                Déposez un fichier CSV ici ou cliquez pour sélectionner
                <input type="file" id="csvFile" style={{display: 'none'}} accept=".csv" onChange={onFileChange}/>
                <div id="fileStatus" className="file-status">{fileStatus}</div>
                <div className="drop-message">{dropMessage}</div>
            </div>
            <div id="errors">{errors}</div>
            <button onClick={onSubmit}>Valider l'import</button>
        </div>
    );
};

export default Step1;