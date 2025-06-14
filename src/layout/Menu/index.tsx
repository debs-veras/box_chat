import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faAngleLeft, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { itensMenu } from '../../types/itensMenu.d';
import { useEffect } from 'react';
import { ComTooltip } from '../../components/Tooltip';
interface MenuComponentProps {
    isMenuOpen: boolean;
    activeSection: itensMenu;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveSection: React.Dispatch<React.SetStateAction<itensMenu>>;
}

export const Menu = ({ isMenuOpen, activeSection, setActiveSection, setIsMenuOpen }: MenuComponentProps) => {

    const toggleMenuCollapse = () => {
        setIsMenuOpen((prev) => !prev);
    };

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

            <ComTooltip tooltipText="Conversas">
                <FontAwesomeIcon
                    icon={faComments}
                    size="lg"
                    color={activeSection == 'conversas' ? "#00A884" : "#54656F"}
                    onClick={() => setActiveSection('conversas')}
                    className={`cursor-pointer transition-all duration-300 ${activeSection == 'conversas' ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
                />
            </ComTooltip>

            <ComTooltip tooltipText="Contatos">
                <FontAwesomeIcon
                    icon={faUser}
                    size="lg"
                    color={activeSection == 'contatos' ? "#00A884" : "#54656F"}
                    onClick={() => setActiveSection('contatos')}
                    className={`cursor-pointer transition-all duration-300 ${activeSection == 'contatos' ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
                />
            </ComTooltip>

            <ComTooltip tooltipText="Modelos de Mensagem">
                <FontAwesomeIcon
                    icon={faFileAlt}
                    size="lg"
                    color={activeSection == 'modeloMensagem' ? "#00A884" : "#54656F"}
                    onClick={() => setActiveSection('modeloMensagem')}
                    className={`cursor-pointer transition-all duration-300 ${activeSection == 'modeloMensagem' ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
                />
            </ComTooltip>
        </div>
    );
};
