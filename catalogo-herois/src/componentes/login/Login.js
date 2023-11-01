import React from "react";
import { useEffect, useState } from "react";
import SpinnerCarregando from '../biblioteca/SpinnerCarregando.js'

export default function Login(props) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [exibirSpinnerCarregando, setExibirSpinnerCarregando] = useState(false);

    useEffect(() => {
        if (usuario !== '' && senha !== '')
            realizarLogin();
    }, [usuario, senha]);

    async function validarLogin(event) {
        let txtUsuario = document.getElementById("txtUsuarioLogin").value;
        let txtPassword = document.getElementById("txtUsuarioSenha").value;
        if (txtUsuario === '' && txtPassword === '') {
            alert("Favor informar usuário e senha");
        } else {
            setUsuario(txtUsuario);
            setSenha(txtPassword);
        }
    }

    async function realizarLogin(event) {
        try {
            setExibirSpinnerCarregando(true);

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
                            alert("Problema: Token recebido está vazio...");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setExibirSpinnerCarregando(false);
        }
    }

    return (
        <>
            <div className="form-group col-sm-4">
                <h4>Log In</h4>
                <hr />
                <div >
                    <label id="lblUsuario">Usuário</label>
                    <input type="text" className="form-control" id="txtUsuarioLogin" />
                </div>
                <div>
                    <label id="lblSenha">Senha</label>
                    <input type="text" className="form-control" id="txtUsuarioSenha" />
                </div>
                <div className="">
                    <br />
                    <button id="btnLogin" className="form-control btn btn-secondary" onClick={(event) => validarLogin(event)}>Conectar</button>
                </div>
                <br/>
                {
                    exibirSpinnerCarregando ? (
                        <SpinnerCarregando msgAuxiliar={''} />
                    ) : null
                }
            </div>
        </>
    )
}