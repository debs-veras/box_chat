import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faAngleLeft, faCog } from '@fortawesome/free-solid-svg-icons';

interface MenuComponentProps {
    isMenuOpen: boolean;
    settings: 'conversas' | 'contatos' | 'settings';
    toggleMenuCollapse: () => void;
    toggleConversas: () => void;
    toggleContatos: () => void;
    toggleSettings: () => void;
}

export const Menu = ({ isMenuOpen, settings, toggleMenuCollapse, toggleConversas, toggleContatos, toggleSettings }: MenuComponentProps) => {
    return (
        <div className='h-full w-16 #F0F2F5 px-1 py-4 flex flex-col gap-8 items-center'>
            <FontAwesomeIcon
                icon={faAngleLeft}
                size="lg"
                color="#54656F"
                onClick={toggleMenuCollapse}
                className={`cursor-pointer transition-transform duration-300 ${isMenuOpen ? 'rotate-0' : 'rotate-180'}`}
            />

            <FontAwesomeIcon
                icon={faComments}
                size="lg"
                color={settings == 'conversas' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleConversas}
                className={`cursor-pointer transition-all duration-300 ${settings == 'conversas' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faUser}
                size="lg"
                color={settings == 'contatos' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleContatos}
                className={`cursor-pointer transition-all duration-300 ${settings == 'contatos' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faCog}
                size="lg"
                color={settings == 'settings' && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleSettings}
                className={`cursor-pointer transition-all duration-300 ${settings == 'settings' && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />
        </div>
    );
};
