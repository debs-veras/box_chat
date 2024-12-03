import { faEnvelope, faKey, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const DadosConta = () => {

    const [userData, setUserData] = useState({
        nome: 'Débora Hellen',
        email: 'deborahellenvp@gmail.com',
        token: '1234abcd5678efgvrsvsvs51561633354',
        numero: '88 9.9253-1384'
    });

    return (
        <div className="w-full h-full flex flex-col bg-gray-50 text-gray-800 p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-[#54656F] text-left">Dados da Conta</h1>

            <div className="grid xl:grid-cols-3 gap-4 w-full">
                <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border text-left">
                    <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold">
                        <FontAwesomeIcon
                            icon={faUser}
                            size="lg"
                            color="#fff"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Nome</p>
                        <p className="text-lg font-semibold">{userData.nome}</p>
                    </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border text-left">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            size="lg"
                            color="#fff"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-lg font-semibold">{userData.email}</p>
                    </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border text-left">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                        <FontAwesomeIcon
                            icon={faPhone}
                            size="lg"
                            color="#fff"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Número</p>
                        <p className="text-lg font-semibold">{userData.numero}</p>
                    </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border text-left">
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
                        <FontAwesomeIcon
                            icon={faKey}
                            size="lg"
                            color="#fff"
                        />
                    </div>
                    <div className="truncate w-[75%]">
                        <p className="text-sm font-medium text-gray-600">Token</p>
                        <div className="flex items-center justify-between gap-3 bg-gray-100 p-2 rounded-md truncate">
                            <p className="text-sm font-mono text-gray-800 truncate">
                                1234abcd5678efgvrsvsvs51561633354
                            </p>
                            <button
                                className="text-sm text-teal-600 hover:text-teal-800 focus:outline-none"
                                onClick={() => navigator.clipboard.writeText("1234abcd5678efgh9012ijkl3456mnop")}
                            >
                                Copiar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
