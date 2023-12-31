import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'
import SpinnerCarregando from '../biblioteca/SpinnerCarregando.js'

export default function CategoriaDetalhes(props) {
    const { idCategoria } = props;
    const [categoriaDetalhes, setCategoriaDetalhes] = useState({});
    const [categoriaNaoEncontrada, setCategoriaNaoEncontrada] = useState(false);
    const [exibirSpinnerCarregando, setExibirSpinnerCarregando] = useState(false);

    async function consultarCategoria() {
        try {
            setExibirSpinnerCarregando(true);
            let jbToken = sessionStorage.getItem("jbToken");

            const response = await fetch("https://localhost:44397/api/Categoria/obterCategoria?idCategoria=" + idCategoria, {
                method: "GET",
                headers: {
                    "Authorization": "bearer " + jbToken
                }
            });
            if (response.ok) {
                const result = await response.json();

                if (result) {
                    setCategoriaDetalhes(result);
                }
            } else if (response.status === 404) {
                setCategoriaNaoEncontrada(true);
            } else if (response.status === 401) {
                sessionStorage.removeItem("jbToken");
                alert("Necessário realizar novamente o login.");

                window.location.reload();
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setExibirSpinnerCarregando(false);
        }
    }

    useEffect(() => {
        return () => {
            consultarCategoria();
        }
    }, []);

    return (
        <>
            {
                exibirSpinnerCarregando ? (
                    <SpinnerCarregando msgAuxiliar={''} />
                ) : (
                    categoriaNaoEncontrada === true ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Categorias na base."} /> : (
                        <div className="row">
                            {
                                <div>
                                    <p className=""><strong>Id: </strong> {categoriaDetalhes.Id}</p>
                                    <p className=""><strong>Nome Categoria: </strong>{categoriaDetalhes.Nome}</p>
                                </div>
                            }
                        </div>
                    )
                )
            }
        </>
    )
}