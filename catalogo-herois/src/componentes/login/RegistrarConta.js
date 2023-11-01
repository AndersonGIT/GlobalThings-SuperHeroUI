import { useEffect, useState } from "react";

export default function RegistrarConta(props) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(() => {
        if (usuario !== '' && senha !== '')
            registrarUsuario();
    }, [usuario, senha]);

    async function validarLogin(event) {
        let txtUsuario = document.getElementById("txtUsuario").value;
        let txtPassword = document.getElementById("txtSenha").value;
        let txtConfirmPassword = document.getElementById("txtConfirmarSenha").value;

        if (txtPassword !== txtConfirmPassword) {
            alert("A senha e confirmação de senha não correspondem");
        } else if (txtUsuario === '') {
            alert("O nome de usuário é obrigatório");
        } else {
            setUsuario(txtUsuario);
            setSenha(txtPassword);
        }
    }

    async function registrarUsuario(event) {
        try {
            let jbToken = sessionStorage.getItem("jbToken");

            var payloadRegistrarConta = {
                Usuario: usuario,
                Senha: senha,
            }

            var response = await fetch("https://localhost:44397/api/Usuario/RegistrarConta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + jbToken
                },
                body: JSON.stringify(payloadRegistrarConta)
            });

            if (response.ok) {
                const result = await response.json();

                if (result) {
                    if (result.Token) {
                        if (result.Token.data !== '') {
                            alert("Registrado com sucesso.");
                            sessionStorage.setItem("jbToken", result.Token.data);
                            window.location.reload();
                        } else {
                            alert("Problema: Token recebido está vazio...");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <div>
                <h4 >Registrar novo usuário</h4>
                <hr />
                <div >
                    <label id="lblUsuario">Usuário</label>
                    <input type="text" id="txtUsuario" />
                </div>
                <div>
                    <label id="lblSenha">Senha</label>
                    <input type="text" id="txtSenha" />
                </div>
                <div >
                    <label id="lblConfirmarSenha">Confirmar Senha</label>
                    <input type="text" id="txtConfirmarSenha" />
                </div>
                <div>
                    <button id="submitRegistroUsuario" onClick={(event) => validarLogin(event)}>Registrar</button>
                </div>
            </div>
        </>
    )
}