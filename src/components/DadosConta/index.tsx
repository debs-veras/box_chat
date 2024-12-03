export const DadosConta = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-teal-600">Configurações da Conta</h1>
            <div className="flex flex-col gap-4 w-full max-w-sm">
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
                    <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold">
                        U
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Nome</p>
                        <p className="text-lg font-semibold">Usuário</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                        📧
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-lg font-semibold">usuario@email.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold">
                        ⚙️
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <p className="text-lg font-semibold">Ativo</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
