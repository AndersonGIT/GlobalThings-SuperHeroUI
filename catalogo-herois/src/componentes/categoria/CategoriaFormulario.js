import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'

export default function CategoriaFormulario(props) {
    const { idCategoria, tipoAcao } = props;
    const [categoriaDados, setCategoriaDados] = useState({});
    const [categoriaNaoEncontrada, setCategoriaNaoEncontrada] = useState(false);

    async function consultarCategoria() {
        try {
            const response = await fetch("https://localhost:44397/api/Categoria?idCategoria=" + idCategoria, {
                method: "GET",
            });
            if (response.ok) {
                const result = await response.json();

                if (result) {
                    setCategoriaDados(result);
                }
            } else if (response.status === 404) {
                setCategoriaNaoEncontrada(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function salvarDados(event) {
        try {
            debugger;
            var response = null;

            let nomeAlterado = document.getElementById("nomeCategoria").value;

            if (nomeAlterado === '') {
                alert("Nome da categoria é obrigatório.");
            } else {
                var payLoad = {
                    Id: (tipoAcao === "Alterar" ? document.getElementById("idCategoria").value : -1),
                    Nome: nomeAlterado
                }
                if (tipoAcao === "Alterar") {
                    response = await fetch("https://localhost:44397/api/Categoria", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payLoad)
                    });
                } else {
                    response = await fetch("https://localhost:44397/api/Categoria", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payLoad)
                    });
                }

                if (response.ok) {
                    const result = await response.json();

                    if (result) {
                        if (tipoAcao === "Alterar") {
                            alert("Alterado com sucesso.");
                        } else {
                            alert("Inserido com sucesso.");
                        }
                        window.location.href = window.location.href;
                    }
                } else {
                    const result = await response.json();

                    alert(result.Message);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        return () => {
            if (tipoAcao === "Alterar")
                consultarCategoria();
        }
    }, []);

    return (
        <>
            {
                (
                    categoriaNaoEncontrada === true && tipoAcao === "Alterar") ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Categorias na base."} /> : (
                    <div className="row">
                        {
                            <div>
                                {
                                    tipoAcao === "Alterar" ?
                                        (
                                            <div>
                                                <p className=""><strong>Id: </strong> <input type="text" id="idCategoria" value={tipoAcao === "Alterar" ? categoriaDados.Id : ''} /> </p>
                                                <label className="">Nome atual da Categoria:</label>
                                                <strong>{categoriaDados.Nome}</strong>
                                            </div>
                                        ) : null
                                }
                                <label>{tipoAcao === "Alterar" ? 'Novo Nome:' : 'Nome Categoria:'}</label>
                                <input type="text" id="nomeCategoria" />
                                <p>
                                    <input type="button" value="Salvar" onClick={(event) => salvarDados(event)} />
                                </p>
                            </div>
                        }
                    </div>
                )
            }
        </>
    )
}