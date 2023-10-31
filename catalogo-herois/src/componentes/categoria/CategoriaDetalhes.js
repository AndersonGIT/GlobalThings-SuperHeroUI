import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'

export default function CategoriaDetalhes(props) {
    const { idCategoria } = props;
    const [categoriaDetalhes, setCategoriaDetalhes] = useState({});
    const [categoriaNaoEncontrada, setCategoriaNaoEncontrada] = useState(false);
    async function consultarCategoria() {
        try {
            const response = await fetch("https://localhost:44397/api/Categoria?idCategoria=" + idCategoria, {
                method: "GET",
            });
            if (response.ok) {
                const result = await response.json();

                if (result) {
                    setCategoriaDetalhes(result);
                }
            } else if (response.status === 404) {
                setCategoriaNaoEncontrada(true);
            }
        } catch (error) {
            console.error("Error:", error);
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
            }
        </>
    )
}