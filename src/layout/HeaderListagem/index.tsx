import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HeaderProps {
    titulo: string;
    setPesquisa?: React.Dispatch<React.SetStateAction<string>> | undefined;
    pesquisa?: string;
    inputAtivo?: boolean
}

const SearchBar = ({ pesquisaConversa, setPesquisaConversa }) => (
    <div className="px-4 flex items-center space-x-2 mb-5">
        <div className="relative flex-1">
            <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                placeholder="Pesquisar"
                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-md border-none focus:outline-none"
                value={pesquisaConversa}
                onChange={(e) => setPesquisaConversa(e.target.value)}
            />
        </div>
    </div>
);

export const HeaderComponent = ({ titulo, pesquisa, setPesquisa, inputAtivo }: HeaderProps) => (
    <>
        <div className="p-5 text-left flex justify-between items-center">
            <div className="text-lg font-semibold">
                {titulo}
            </div>
        </div>

        {inputAtivo && (<SearchBar pesquisaConversa={pesquisa} setPesquisaConversa={setPesquisa} />)}
    </>
);
