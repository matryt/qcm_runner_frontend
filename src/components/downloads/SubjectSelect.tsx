import React, { useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { get_all_subjects } from '../../services/apiFetcher';

interface SubjectSelectProps {
    onSelect: (subjectId: string) => void;
    subjects: Subject[];
    setSubjects: (subjects: Subject[]) => void;
}

interface Subject {
    id: string;
    name: string;
}

const SubjectSelect: React.FC<SubjectSelectProps> = ({ onSelect, subjects, setSubjects }) => {
    const { token } = useAuth();

    useEffect(() => {
        const fetchSubjects = async () => {
            if (token) {
                const subjects = await get_all_subjects(token);
                setSubjects(subjects);
            }
        };
        fetchSubjects().then();
    }, [token, setSubjects]);

    return (
        <select onChange={(e) => onSelect(e.target.value)}>
            <option value="">Sélectionner une matière</option>
            {subjects.length > 0 && subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                    {subject.name}
                </option>
            ))}
        </select>
    );
};

export default SubjectSelect;