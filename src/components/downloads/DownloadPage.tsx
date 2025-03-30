import React, { useState } from 'react';
import SubjectSelect from './SubjectSelect';
import QuizList from './QuizList';
import {AuthProvider} from "../../utils/AuthContext.tsx";
import "./DownloadPage.css"
import Menu from "../Menu.tsx";

interface Subject {
    id: string,
    name: string
}

const DownloadPage: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [subjects, setSubjects] = useState<Subject[]>([]);

    return (
        <AuthProvider>
            <Menu />
            <div className="App">
                <div className="download">
                    <h1>Quiz Runner</h1>
                    <SubjectSelect onSelect={setSelectedSubject} subjects={subjects} setSubjects={setSubjects}/>
                    <QuizList subjectId={selectedSubject} subjects={subjects}/>
                </div>
            </div>
        </AuthProvider>
);
};

export default DownloadPage;