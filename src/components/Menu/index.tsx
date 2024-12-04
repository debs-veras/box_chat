import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faAngleLeft, faCog, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { itensMenu } from '../../types/itensMenu.d';

interface MenuComponentProps {
    isMenuOpen: boolean;
    activeSection: itensMenu;
    toggleMenuCollapse: () => void;
    toggleConversas: () => void;
    toggleContatos: () => void;
    toggleSettings: () => void;
    toggleModelosMensagem: () => void;
}

export const Menu = ({ isMenuOpen, activeSection, toggleMenuCollapse, toggleConversas, toggleContatos, toggleSettings, toggleModelosMensagem }: MenuComponentProps) => {
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
                onClick={toggleConversas}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'conversas' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faUser}
                size="lg"
                color={activeSection == 'contatos' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleContatos}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'contatos' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />
            <FontAwesomeIcon
                icon={faFileAlt}
                size="lg"
                color={activeSection == 'modeloMensagem' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleModelosMensagem}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'modeloMensagem' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faCog}
                size="lg"
                color={activeSection == 'settings' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleSettings}
                className={`cursor-pointer transition-all duration-300 ${activeSection == 'settings' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />
        </div>
    );
};
