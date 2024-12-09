import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faAngleLeft, faCog, faFileAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { itensMenu } from '../../types/itensMenu.d';
import { useEffect } from 'react';

interface MenuComponentProps {
    isMenuOpen: boolean;
    activeSection: itensMenu;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveSection: React.Dispatch<React.SetStateAction<itensMenu>>;
    toggleMenuCollapse: () => void;
}

export const Menu = ({ isMenuOpen, activeSection, toggleMenuCollapse, setActiveSection, setIsMenuOpen }: MenuComponentProps) => {
    useEffect(() => {
        if (!isMenuOpen) setIsMenuOpen(true);
    }, [activeSection]);

    return (
        <div className='h-full w-16 #F0F2F5 px-1 py-4 flex flex-col gap-8 items-center'>
            <FontAwesomeIcon
                icon={faAngleLeft}
                size="lg"
                color={activeSection == 'modeloMensagem' ? "#A0A0A0" : "#54656F"}
                onClick={activeSection == 'modeloMensagem' ? undefined : toggleMenuCollapse}
                className={`cursor-pointer transition-transform duration-300 ${isMenuOpen ? 'rotate-0' : 'rotate-180'} ${activeSection == 'modeloMensagem' ? 'opacity-50 pointer-events-none' : ''}`}
            />

            <FontAwesomeIcon
                icon={faComments}
                size="lg"
                color={activeSection == 'conversas' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={() => setActiveSection('conversas')}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'conversas' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faUser}
                size="lg"
                color={activeSection == 'contatos' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={() => setActiveSection('contatos')}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'contatos' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />
            
            <FontAwesomeIcon
                icon={faFileAlt}
                size="lg"
                color={activeSection == 'modeloMensagem' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={() => setActiveSection('modeloMensagem')}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'modeloMensagem' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faUsers}
                size="lg"
                color={activeSection == 'gruposContatos' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={() => setActiveSection('gruposContatos')}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'gruposContatos' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faCog}
                size="lg"
                color={activeSection == 'settings' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={() => setActiveSection('settings')}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'settings' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />
        </div>
    );
};
