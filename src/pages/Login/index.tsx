import LoginForm from "../../templates/forms/LoginForm";

export default function Login(): JSX.Element {

    return (
        <div className="min-h-screen grid place-items-center bg-primary-50">
            <div className="flex flex-col gap-10 items-center sm:flex-row">
                <img
                    className="w-80 lg:w-96 xl:w-[713px] object-contain"
                    src="imagens/logo_principal.png"
                    alt="logo principal"
                />
                <div className="w-full h-fit max-w-sm lg:w-96">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
