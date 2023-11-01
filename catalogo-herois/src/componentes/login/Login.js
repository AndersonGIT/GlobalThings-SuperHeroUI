import React from "react";
import { useEffect, useState } from "react";

export default function Login(props) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(() => {
        if (usuario !== '' && senha !== '')
            realizarLogin();
    }, [usuario, senha]);

    async function validarLogin(event) {
        let txtUsuario = document.getElementById("txtUsuarioLogin").value;
        let txtPassword = document.getElementById("txtUsuarioSenha").value;
        if (txtUsuario === '' && txtPassword === '') {
            alert("Favor informar usu�rio e senha");
        } else {
            setUsuario(txtUsuario);
            setSenha(txtPassword);
        }
    }

    async function realizarLogin(event) {
        try {
            var payloadRegistrarConta = {
                UsuarioLogin: usuario,
                UsuarioSenha: senha
            }

            var response = await fetch("https://localhost:44397/api/Usuario/ConectarConta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payloadRegistrarConta)
            });

            if (response.ok) {
                const result = await response.json();

                if (result) {
                    if (result.Token) {
                        if (result.Token.data !== '') {
                            sessionStorage.setItem("jbToken", result.Token.data);
                            window.location.reload();
                        } else {
                            alert("Problema: Token recebido est� vazio...");
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
                <h4>Log In</h4>
                <hr />
                <div >
                    <label id="lblUsuario">Usu�rio</label>
                    <input type="text" id="txtUsuarioLogin" />
                </div>
                <div>
                    <label id="lblSenha">Senha</label>
                    <input type="text" id="txtUsuarioSenha" />
                </div>
                <button id="btnLogin" onClick={(event) => validarLogin(event)}>Conectar</button>
            </div>
        </>
    )
}