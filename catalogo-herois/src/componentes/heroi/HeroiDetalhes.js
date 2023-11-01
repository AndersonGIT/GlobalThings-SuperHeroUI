import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'

export default function HeroiDetalhes(props) {
    const { idHeroi } = props;
    const [heroiDetalhes, setHeroiDetalhes] = useState({});
    const [heroiNaoEncontrado, setHeroiNaoEncontrado] = useState(false);

    async function consultarHeroi() {
        try {
            let jbToken = sessionStorage.getItem("jbToken");

            const response = await fetch("https://localhost:44397/api/Heroi?idHeroi=" + idHeroi, {
                method: "GET",
                headers: {
                    "Authorization": "bearer " + jbToken
                }
            });
            if (response.ok) {
                const result = await response.json();

                if (result) {
                    setHeroiDetalhes(result);
                }              
            } else if (response.status === 404) {
                setHeroiNaoEncontrado(true);
            } else if (response.status === 401) {
                sessionStorage.removeItem("jbToken");
                alert("Necessário realizar novamente o login.");

                window.location.reload();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        return () => {
            consultarHeroi();
        }
    }, []);

    return (
        <>
            {
                heroiNaoEncontrado === true ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Heróis na base."} /> : (
                    <div className="row">
                        {
                            <div>
                                <p className=""><strong>Id: </strong> {heroiDetalhes.Id}</p>
                                <p className=""><strong>Nome Herói: </strong>{heroiDetalhes.Nome}</p>
                                <p className=""><strong>Categoria Herói: </strong>{heroiDetalhes.IdCategoria}</p>
                                <p className=""><strong>Categoria: </strong>{heroiDetalhes.NomeCategoria}</p>
                            </div>
                        }
                    </div>
                )
            }
        </>
    )
}