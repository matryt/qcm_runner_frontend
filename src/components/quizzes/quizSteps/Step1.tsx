import React, { useState, useRef } from 'react';
import "./Step1.css";

interface Step1Props {
    showStep: (step: number) => void;
    handleFileUpload: (file: File) => boolean;
    fileStatus: string;
    errors: string;
}

const Step1: React.FC<Step1Props> = ({ showStep, handleFileUpload, fileStatus, errors }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dropMessage, setDropMessage] = useState<string>(
        'Déposez un fichier (CSV/JSON/YAML) ici ou cliquez pour sélectionner'
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setDropMessage('Fichier sélectionné avec succès.');
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]);
            setDropMessage('Fichier déposé avec succès.');
        }
    };

    const onSubmit = () => {
        if (!file) {
            alert('Veuillez sélectionner un fichier.');
            return;
        }

        const isSuccess = handleFileUpload(file);
        if (isSuccess) {
            showStep(2);
        } else {
            setDropMessage("Erreur lors de l'importation du fichier. Veuillez vérifier le format.");
        }
    };

    return (
        <div className="step-container step1-container">
            <div className="step-header">
                <h2>📎 Étape 1 : Chargez votre fichier</h2>
                <p className="step-description">Importez votre quiz au format CSV, JSON ou YAML</p>
            </div>

            <div className="info-cards">
                <div className="info-card">
                    <div className="info-icon">📄</div>
                    <div className="info-title">Formats supportés</div>
                    <div className="info-text">CSV, JSON, YAML</div>
                </div>
                <div className="info-card">
                    <div className="info-icon">🔧</div>
                    <div className="info-title">Structure JSON/YAML</div>
                    <div className="info-text">
                        <code>responses: [{`{ text, isCorrect }`}]</code> ou <code>options</code>/<code>correctAnswers</code>
                    </div>
                </div>
            </div>

            <div 
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
            >
                <div className="drop-icon">📁</div>
                <div className="drop-message">{dropMessage}</div>
                {file && (
                    <div className="file-info">
                        <span className="file-name">📎 {file.name}</span>
                        <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                    </div>
                )}
                <input 
                    ref={fileInputRef}
                    type="file" 
                    id="csvFile" 
                    style={{ display: 'none' }} 
                    accept=".csv,.json,.yaml,.yml" 
                    onChange={onFileChange}
                />
            </div>
            
            {fileStatus && <div className="file-status success-message">{fileStatus}</div>}
            
            {errors.length > 0 && (
                <div className="errors-container">
                    {errors.split('\n').map((error, index) => (
                        <div key={index} className="error-message">⚠️ {error}</div>
                    ))}
                </div>
            )}
            
            <button 
                type="button"
                className="primary-button" 
                onClick={onSubmit} 
                disabled={!file}
            >
                🚀 Valider l'import
            </button>
        </div>
    );
};

export default Step1;