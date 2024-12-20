import React, { FormEventHandler, ReactNode } from "react";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";
import InputMask from "comigo-tech-react-input-mask";
import classNames from "../../utils/classNames";
import * as Form from "@radix-ui/react-form";

type propsField = {
    children?: Array<JSX.Element> | JSX.Element;
    name: string;
    label?: string | JSX.Element;
    hideLabel?: boolean;
    subTitulo?: string;
    opcional?: boolean;
    className?: string;
    icone?: JSX.Element | null;
    mostrarLabel?: boolean;
    classNameIconeContainer?: string;
}

type propsInput = {
    control?: Control<any>;
    register?: UseFormRegister<any>;
    value?: string | number | boolean | null;
    disabled?: boolean;
    onChange?: Function;
    onInputChange?: Function;
    onSubmit?: Function;
    labelOpcaoPadrao?: string;
    placeholder?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    rows?: number;
    align?: string;
    type?: string;
    min?: number | Date | string | null;
    max?: number | Date | string | null;
    maxLength?: number | null;
    step?: number;
    tamanhoMascara?: number;
    temBotao?: boolean;
    isClearable?: boolean;
    isLoading?: boolean;
    decimalPlaces?: number;
    setValue?: UseFormSetValue<any>;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    copyClipboard?: boolean;
    lowercase?: boolean;
    semOpcaoNula?: boolean;
    isFiltro?: boolean;
    dataVazia?: boolean;
    minimoFuncionalidades?: boolean;
}

type propsFormulario = {
    className?: string;
    children?: ReactNode;
    align?: string;
    onSubimit?: FormEventHandler<HTMLFormElement>;
}

function normalizar(valor: string): string {
    return valor.replace(/[^0-9]/g, "");
}

export default function Formulario({ className, children, align = "end" }: propsFormulario): JSX.Element {
    return (
        <Form.Root
            autoComplete="off"
            className={classNames("grid grid-cols-1 gap-4", align == "end" ? "items-end" : "items-start", className)}
            onSubmit={(e) => e.preventDefault()}
        >
            {children}
        </Form.Root>
    )
}

Formulario.Field = ({ children, ...props }: propsField): JSX.Element => {
    return (
        <Form.Field className={props.className} name={props.name}>
            {!props.hideLabel && (
                <Form.Label
                    className="flex flex-row item-center gap-1 p-1 text-sm font-medium text-gray-700"
                    htmlFor={props.name}>
                    <p>
                        {props.label}
                        {props.subTitulo && (
                            <i className="text-xs text-gray-400 ml-4">
                                {props.subTitulo}
                            </i>
                        )}
                    </p>
                    {!props.opcional ? <span className="text-red-500">*</span> : null}
                </Form.Label>
            )}
            <div className="flex flex-row items-center">
                {props.icone &&

                    <div className={classNames("ring-1 ring-gray-300 rounded-l-md p-3 sm:text-sm", props.classNameIconeContainer)}>
                        {props.icone}
                    </div>
                }
                <Form.Control asChild>
                    {children}
                </Form.Control>
            </div>
        </Form.Field>
    )
}

Formulario.InputTexto = (props: propsField & propsInput): JSX.Element => {
    const { register } = props;
    const { ...propsField }: propsField = props;
    const { ...propsInput }: propsInput = props;

    return (
        <Formulario.Field {...propsField}>
            <>
                <input
                    id={propsInput.isFiltro ? `filtro_${propsField.name}` : propsField.name}
                    disabled={propsInput.disabled}
                    name={propsField.name}
                    type={propsInput.type}
                    min={propsInput.min != null && typeof propsInput.min != "object" ? propsInput.min : ""}
                    max={propsInput.max != null && typeof propsInput.max != "object" ? propsInput.max : ""}
                    step={propsInput.step}
                    maxLength={propsInput.maxLength || undefined}
                    placeholder={propsInput.placeholder}
                    onKeyDown={propsInput.onKeyDown && propsInput.onKeyDown}
                    className={classNames(
                        propsField.icone || propsInput.copyClipboard ? (propsInput.copyClipboard ? "rounded-l-md border-r-0" : "rounded-r-md") : "rounded-md",
                        `w-full border border-gray-300 shadow-sm py-2 px-3 disabled:bg-gray-100 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-transparent`,
                        (!!propsInput.align ? propsInput.align : "text-left")
                    )}
                    value={propsInput.value && propsInput.value !== true ? propsInput.value : undefined}
                    {...register && register(propsField.name)}
                    onChange={e => {
                        if (propsInput.type != "number") {
                            const positionCursor = e.target.selectionStart;

                            if (!propsInput.lowercase) e.target.value = e.target.value.toString().toUpperCase()

                            if (propsInput.type == "number" &&
                                propsInput.min != null && typeof propsInput.min != "object" &&
                                Number(e.target.value) < (propsInput.min as number)
                            )
                                e.target.value = (Number(e.target.value) * (-1)).toString();

                            register && register(propsField.name).onChange(e);
                            e.target.selectionStart = positionCursor;
                            e.target.selectionEnd = positionCursor;
                        }
                    }}
                />

            </>
        </Formulario.Field>
    )
}

Formulario.TextArea = (props: propsField & propsInput): JSX.Element => {
    const { register } = props;
    const { ...propsField } = props;
    const { ...propsInput } = props;

    return (
        <Formulario.Field {...propsField}>
            <textarea
                rows={propsInput.rows}
                id={propsInput.isFiltro ? `filtro_${propsField.name}` : propsField.name}
                disabled={propsInput.disabled}
                onChange={e => propsInput.onChange && propsInput.onChange(e.target.value)}
                placeholder={propsInput.placeholder}
                className="py-2 px-4 border border-gray-300 focus:outline-none disabled:bg-gray-100 focus:ring-primary-500 focus:border-primary-500 flex-grow block w-full min-w-0 rounded-md sm:text-sm"
                {...register && register(propsField.name)}
            />
        </Formulario.Field>
    )
}

Formulario.InputCelular = (props: propsField & propsInput): JSX.Element => {
    const { register } = props;
    const { ...propsField }: propsField = props;
    const { ...propsInput }: propsInput = props;

    return (
        <Formulario.Field {...propsField}>
            <>
                <InputMask
                    id={propsInput.isFiltro ? `filtro_${propsField.name}` : propsField.name}
                    name={propsField.name}
                    mask={propsInput.tamanhoMascara == 10 ? "(99) 9999 - 9999" : "(99) 99999 - 9999"}
                    alwaysShowMask={false}
                    value={propsInput.value}
                    disabled={propsInput.disabled}
                    onChange={(valor: React.ChangeEvent<HTMLInputElement>) => propsInput.onChange && propsInput.onChange(normalizar(valor.target.value))}
                    placeholder={propsInput.tamanhoMascara == 10 ? "(99) 9999 - 9999" : "(99) 99999 - 9999"}
                    className={"rounded-md w-full border disabled:bg-gray-100 border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"}
                    {...register && register(propsField.name)}
                />
            </>
        </Formulario.Field>
    )
}
