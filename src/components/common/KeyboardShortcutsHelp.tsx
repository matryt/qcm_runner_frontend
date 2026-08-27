import React, { useState } from 'react';
import './KeyboardShortcutsHelp.css';

interface Shortcut {
    keys: string[];
    description: string;
}

const shortcuts: Shortcut[] = [
    { keys: ['1', '…', '9'], description: 'Cocher / décocher une option' },
    { keys: ['Entrée'], description: 'Valider la réponse' },
    { keys: ['←'], description: 'Question précédente' },
    { keys: ['→'], description: 'Question suivante' },
];

const KeyboardShortcutsHelp: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="shortcuts-help-container"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button 
                type="button" 
                className="shortcuts-help-trigger"
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Afficher les raccourcis clavier"
            >
                ⌨️
            </button>

            {isOpen && (
                <div className="shortcuts-tooltip">
                    <div className="shortcuts-title">Raccourcis clavier</div>
                    <ul className="shortcuts-list">
                        {shortcuts.map((sc, i) => (
                            <li key={i} className="shortcuts-item">
                                <div className="shortcuts-keys">
                                    {sc.keys.map((k, j) => (
                                        <kbd key={j} className="shortcut-kbd">{k}</kbd>
                                    ))}
                                </div>
                                <span className="shortcuts-desc">{sc.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default KeyboardShortcutsHelp;