import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faAngleLeft, faCog } from '@fortawesome/free-solid-svg-icons';

interface MenuComponentProps {
    isMenuOpen: boolean;
    showContatos: boolean;
    showConversas: boolean;
    showSettings: boolean;
    toggleMenuCollapse: () => void;
    toggleConversas: () => void;
    toggleContatos: () => void;
    toggleSettings: () => void;
}

export const Menu = ({ isMenuOpen, showContatos, showSettings, showConversas, toggleMenuCollapse, toggleConversas, toggleContatos,  toggleSettings }: MenuComponentProps) => {
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
                color={showConversas && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleConversas}
                className={`cursor-pointer transition-all duration-300 ${showConversas && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faUser}
                size="lg"
                color={showContatos && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleContatos}
                className={`cursor-pointer transition-all duration-300 ${showContatos && isMenuOpen  ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />

            <FontAwesomeIcon
                icon={faCog}
                size="lg"
                color={showSettings && isMenuOpen ? "#00A884" : "#54656F"}
                onClick={toggleSettings}
                className={`cursor-pointer transition-all duration-300 ${showSettings && isMenuOpen ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
            />
        </div>
    );
};
