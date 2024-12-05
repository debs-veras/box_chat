import { useState } from 'react';
import { ModalPerfil } from '../../templates/modal/ModalPerfil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';

const Configuracoes = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex">
            <div className="w-full">
                <ul className="text-lg text-left">
                    <li className="cursor-pointer transition hover:bg-[#F5F6F6] py-3 px-5 flex gap-4" onClick={() => setIsModalOpen(true)} >
                        <FontAwesomeIcon
                            icon={faUser}
                            color='#54656F'
                            size="lg"
                            className={`cursor-pointer transition-all duration-300`}
                        />
                        Editar Conta
                    </li>
                    <li className="cursor-pointer transition hover:bg-[#F5F6F6] py-3 px-5 flex gap-4">
                        <FontAwesomeIcon
                            icon={faPowerOff}
                            color='#54656F'
                            size="lg"
                            className={`cursor-pointer transition-all duration-300`}
                        />
                        Sair
                    </li>
                </ul>
            </div>

            <ModalPerfil
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
            />
        </div>
    );
};

export default Configuracoes;
