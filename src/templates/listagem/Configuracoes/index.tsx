import { useState } from 'react';
import { ModalPerfil } from '../../modal/ModalPerfil';
import { FaPowerOff, FaUser } from 'react-icons/fa';
import { HeaderComponent } from '../../../components/HeaderListagem';

export const Configuracoes = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <HeaderComponent titulo="Configuração" />

            <div className="w-full">
                <ul className="text-lg text-left">
                    <li className="cursor-pointer transition hover:bg-[#F5F6F6] py-3 px-5 flex gap-4" onClick={() => setIsModalOpen(true)} >
                        <FaUser
                            color="#54656F"
                            size="1.25rem"
                            className="cursor-pointer transition-all duration-300"
                        />
                        Editar Conta
                    </li>
                    <li className="cursor-pointer transition hover:bg-[#F5F6F6] py-3 px-5 flex gap-4">
                        <FaPowerOff
                            color="#54656F"
                            size="1.25rem"
                            className="cursor-pointer transition-all duration-300"
                        />
                        Sair
                    </li>
                </ul>

                <ModalPerfil
                    isOpen={isModalOpen}
                    handleClose={handleCloseModal}
                    handleSave={handleSave}
                />
            </div>
        </>
    );
};
