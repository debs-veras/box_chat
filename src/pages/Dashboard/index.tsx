import { useEffect, useState } from 'react';
import GraficoBarra from '../../components/GraficoBarra';
import { FaBullhorn, FaRegAddressBook, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({
    campanhas: 10,
    grupos: 5,
    contatos: 120,
  });
  const dadosGraficoAcessoPorDia = [
    { descricao: "01/12/2024", valor: 120 },
    { descricao: "02/12/2024", valor: 180 },
    { descricao: "03/12/2024", valor: 150 },
    { descricao: "04/12/2024", valor: 200 },
    { descricao: "05/12/2024", valor: 175 },
    { descricao: "06/12/2024", valor: 220 },
    { descricao: "07/12/2024", valor: 250 },
    { descricao: "08/12/2024", valor: 300 },
    { descricao: "09/12/2024", valor: 280 },
    { descricao: "10/12/2024", valor: 210 },
    { descricao: "11/12/2024", valor: 190 },
    { descricao: "12/12/2024", valor: 220 },
    { descricao: "13/12/2024", valor: 240 },
    { descricao: "14/12/2024", valor: 260 },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de Relatórios</h1>
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Card de Campanhas */}
          <div className="bg-white p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700">Campanhas</h2>
              <p className="text-4xl font-bold text-indigo-600">{data.campanhas}</p>
            </div>
            <div className="text-indigo-600 text-5xl">
              <FaBullhorn />
            </div>
          </div>

          {/* Card de Grupos */}
          <div className="bg-white p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700">Grupos</h2>
              <p className="text-4xl font-bold text-green-600">{data.grupos}</p>
            </div>
            <div className="text-green-600 text-5xl">
              <FaUsers />
            </div>
          </div>

          {/* Card de Contatos */}
          <div className="bg-white p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-700">Contatos</h2>
              <p className="text-4xl font-bold text-blue-600">{data.contatos}</p>
            </div>
            <div className="text-blue-600 text-5xl">
              <FaRegAddressBook />
            </div>
          </div>

        </div>

        <GraficoBarra>
          <GraficoBarra.Header>
            <GraficoBarra.Header.Titulo>Acessos por Dia</GraficoBarra.Header.Titulo>
          </GraficoBarra.Header>

          <GraficoBarra.Content
            data={dadosGraficoAcessoPorDia?.length > 0
              ? [
                ["Acessos", "Acessos por dia"],
                ...dadosGraficoAcessoPorDia.map(item => [item.descricao, item.valor])
              ]
              : []}
          />

        </GraficoBarra>
      </div>
    </div>
  );
};

export default Dashboard;
