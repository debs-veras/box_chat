import * as Tooltip from "@radix-ui/react-tooltip";

interface ComTooltipProps {
    tooltipText: string;
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
}

export const ComTooltip = ({ tooltipText, children, onClick, active = false }: ComTooltipProps) => {
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button
                        onClick={onClick}
                        className={`cursor-pointer transition-all duration-300 ${active ? 'scale-110 bg-[#D9DBDF] w-fit p-2 rounded-full' : ''}`}
                    >
                        {children}
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-md shadow-lg transform transition-transform duration-200 ease-in-out"
                        sideOffset={5}
                    >
                        {tooltipText}
                        <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};