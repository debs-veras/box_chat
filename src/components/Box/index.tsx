import { useAutoAnimate } from "@formkit/auto-animate/react";
import classNames from "../../utils/classNames";
import LoadingPage from "../LoadingPage";

type Props = {
    className?: string;
    children?: React.ReactNode;
    horizontal?: boolean,
}

type PropsHeader = {
    className?: string;
    children?: React.ReactNode;
    padding?: string;
    semLinha?: boolean;
}

export const BoxContainer = ({ children, className, horizontal }: Props) => {
    const [autoAnimateRef] = useAutoAnimate();

    return (
        <div ref={autoAnimateRef} className={classNames(
            "flex gap-4",
            !horizontal && "flex-col",
            className
        )}>
            {children}
        </div>
    )
}

type PropsBox = {
    className?: string;
    children?: React.ReactNode;
    horizontal?: boolean,
    style?: React.CSSProperties,
    loading?: boolean
}

export default function Box(props: PropsBox): JSX.Element {
    const {
        className,
        children,
        horizontal,
        style,
        loading
    } = props;

    return (
        <div
            className={classNames(
                "bg-white p-4 shadow flex rounded-lg gap-y-2",
                !horizontal && "flex-col",
                className
            )}
            style={style}
        >
            {children}

            {loading && (
                <LoadingPage />
            )}
        </div>
    )
}

const Header = (props: PropsHeader): JSX.Element => {
    const {
        children,
        className,
        padding = "pb-3",
        semLinha
    } = props;

    return (
        <div className={classNames("flex w-full justify-between items-center col-span-full", className, padding, !semLinha && "border-b")}>
            {children}
        </div>
    )
}

type PropsContent = {
    children: React.ReactNode | string | string,
    flexDirection?: "flex-row" | "flex-col",
    className?: string;
}

const Content = ({ children, flexDirection = "flex-row", className }: PropsContent) => {
    return (
        <div className={classNames("flex flex-col gap-2 items-start", flexDirection, className)}>
            {children}
        </div>
    )
}

Content.Titulo = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <h2 id="applicant-information-title" className={classNames("text-lg leading-6 font-medium text-gray-900", className)}>
            {children}
        </h2>
    )
}

Content.Subtitulo = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <p className={classNames("max-w-2xl font-normal text-sm text-gray-500", className)}>
            {children}
        </p>
    )
}

Header.Botoes = ({ children }: { children: React.ReactNode | string }) => {
    return (
        <div className="flex justify-end gap-4">
            {children}
        </div>
    )
}

Header.Content = Content;
Box.Header = Header;