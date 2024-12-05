import * as ScrollAreaRadix from '@radix-ui/react-scroll-area';
import classNames from '../../utils/classNames';

type Props = {
    children: Array<JSX.Element> | JSX.Element;
    className?: string;
    paddingX?: string;
    width?: string;
}

const ScrollArea = ({ children, className, paddingX = 'px-4', width = "w-full" }: Props): JSX.Element => (
    <ScrollAreaRadix.Root className={classNames("h-full overflow-hidden", width, className, paddingX)}>
        <ScrollAreaRadix.Viewport className="w-full h-full rounded">
            {children}
        </ScrollAreaRadix.Viewport>
        
        <ScrollAreaRadix.Scrollbar
            className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
        >
            <ScrollAreaRadix.Thumb className="flex-1 bg-gray-600 rounded-md relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollAreaRadix.Scrollbar>

        <ScrollAreaRadix.Scrollbar
            className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="horizontal"
        >
            <ScrollAreaRadix.Thumb className="flex-1 bg-gray-600 rounded-md relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollAreaRadix.Scrollbar>
        <ScrollAreaRadix.Corner className="bg-black" />
    </ScrollAreaRadix.Root>
);

export default ScrollArea;
