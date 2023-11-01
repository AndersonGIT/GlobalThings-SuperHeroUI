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
                                <button className="btn btn-light" onClick={() => desconectarConta()}>Desconectar</button>
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