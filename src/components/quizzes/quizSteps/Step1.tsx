import React, { useState, useEffect } from 'react';

interface Step1Props {
    showStep: (step: number) => void;
    handleFileUpload: (file: File) => boolean;
    fileStatus: string;
    errors: string;
}

const Step1: React.FC<Step1Props> = ({ showStep, handleFileUpload, fileStatus, errors }) => {
    const [file, setFile] = useState<File | null>(null);
    const [dropMessage, setDropMessage] = useState<string>('Déposez un fichier (CSV/JSON/YAML) ici ou cliquez pour sélectionner');

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
            const result = handleFileUpload(file);
            console.log(result);
            if (handleFileUpload(file) == true) showStep(2);
            else {
                setDropMessage('Erreur lors de l\'importation du fichier. Veuillez vérifier le format.');
            }
        } else {
            alert('Veuillez sélectionner un fichier.');
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
            <h2>Étape 1: Chargez votre fichier</h2> 
            <p>Formats supportés: CSV, JSON, YAML</p>
            <p>JSON/YAML: vous pouvez utiliser <code>{`responses: [{ text, isCorrect }]`}</code> ou <code>options</code>/<code>correctAnswers</code>.</p>

            <div className="drop-zone" onClick={() => document.getElementById('csvFile')?.click()}>
                <div className="drop-message">{dropMessage}</div>
                <input type="file" id="csvFile" style={{display: 'none'}} accept=".csv,.json,.yaml,.yml" onChange={onFileChange}/>
                <div id="fileStatus" className="file-status">{fileStatus}</div>
            </div>
            <div id="errors">
                    {errors.length > 0 && errors.split('\n').map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
            </div>
            <button onClick={onSubmit}>Valider l'import</button>
        </div>
    );
};

export default Step1;