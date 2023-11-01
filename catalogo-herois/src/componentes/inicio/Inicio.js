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
                <div className="row justify-content-center">
                    <div className="col-md-2 justify-content-center">
                    <span></span>
                    </div>
                    <div className="col-md-8 justify-content-center">
                        {
                            !usuarioLogado ? (
                                <div className="row">
                                    <RegistrarConta />
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
                    <div className="col-md-2 justify-content-center">
                        <span></span>
                    </div>
                </div>
            </div>
        </>
    )
}