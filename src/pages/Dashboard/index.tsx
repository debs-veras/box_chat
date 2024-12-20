import { useEffect, useState } from 'react';
import { TotalOrderLineChartCard } from '../../templates/cards/dashboard/card1';
import GraficoBarra from '../../components/GraficoBarra';

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

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
        <div className='grid grid-cols-3 mb-5'>
          <div className='col-span-1'>
            <TotalOrderLineChartCard isLoading={isLoading} />
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
