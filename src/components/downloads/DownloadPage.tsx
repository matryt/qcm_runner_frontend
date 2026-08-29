import React, { useState } from 'react';
import SubjectSelect from './SubjectSelect';
import QuizList from './QuizList';
import { AuthProvider } from '../../utils/AuthContext.tsx';
import Menu from '../Menu.tsx';
import './DownloadPage.css';

interface Subject {
    id: string;
    name: string;
}

const DownloadPage: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [subjects, setSubjects] = useState<Subject[]>([]);

    return (
        <AuthProvider>
            <div className="download-wrapper">
                <Menu />
                
                <main className="download-container">
                    <header className="download-header">
                        <span className="download-badge">📚 Bibliothèque</span>
                        <h1>Choisissez votre quiz</h1>
                        <p className="download-subtitle">
                            Sélectionnez un sujet ou recherchez un test pour lancer votre session.
                        </p>
                    </header>

                    <div className="filters-bar">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Rechercher un quiz par titre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button 
                                    type="button" 
                                    className="clear-search"
                                    onClick={() => setSearchTerm('')}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <SubjectSelect 
                            onSelect={setSelectedSubject} 
                            subjects={subjects} 
                            setSubjects={setSubjects} 
                        />
                    </div>

                    <QuizList 
                        subjectId={selectedSubject} 
                        subjects={subjects} 
                        searchTerm={searchTerm}
                    />
                </main>
            </div>
        </AuthProvider>
    );
};

export default DownloadPage;