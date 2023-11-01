import Heroi from '../heroi/Heroi.js'
import Categoria from '../categoria/Categoria.js'
import Login from '../login/Login.js'
import RegistrarConta from '../login/RegistrarConta.js'
import { useEffect, useState } from 'react'

export default function Inicio(props) {
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    useEffect(() => {
        let jbToken = sessionStorage.getItem("jbToken");
        if (jbToken === '' || jbToken === null) {
            setUsuarioLogado(false);
        } else {
            setUsuarioLogado(true);
        }
    }, []);

    async function desconectarConta(event) {
        try {
            //let jbToken = sessionStorage.getItem("jbToken");
            //var payLoadDesconectar = {
            //    UsuarioLogin: "",
            //    UsuarioSenha: ""
            //}

            //var response = await fetch("https://localhost:44397/api/usuario/desconectarconta", {
            //    method: "POST",
            //    headers: {
            //        "Content-Type": "application/json",
            //        "Authorization": "bearer " + jbToken
            //    },
            //    body: JSON.stringify(payLoadDesconectar)
            //});

            //if (response.ok) {
            //    const result = await response.json();
            //} else if (response.status === 401) {
            //    sessionStorage.removeItem("jbToken");
            //    alert("Necessário realizar novamente o login.");

            //    window.location.reload();
            //}
            sessionStorage.removeItem("jbToken");
            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <div className="container">
                {
                    !usuarioLogado ? (
                        <div>
                            <RegistrarConta />
                            <hr />
                            <Login />
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => desconectarConta()}>Desconectar</button>
                            <hr />
                            <Heroi />
                            <hr />
                            <Categoria />
                        </div>
                    )
                }
            </div>
        </>
    )
}