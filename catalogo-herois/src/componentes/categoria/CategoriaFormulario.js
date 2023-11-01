import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'
import SpinnerCarregando from '../biblioteca/SpinnerCarregando.js'

export default function CategoriaFormulario(props) {
    const { idCategoria, tipoAcao } = props;
    const [categoriaDados, setCategoriaDados] = useState({});
    const [categoriaNaoEncontrada, setCategoriaNaoEncontrada] = useState(false);
    const [exibirSpinnerCarregando, setExibirSpinnerCarregando] = useState(false);

    async function consultarCategoria() {
        try {
            setExibirSpinnerCarregando(true);

            let jbToken = sessionStorage.getItem("jbToken");

            const response = await fetch("https://localhost:44397/api/Categoria?idCategoria=" + idCategoria, {
                method: "GET",
                headers: {
                    "Authorization": "bearer " + jbToken
                }
            });
            if (response.ok) {
                const result = await response.json();

                if (result) {
                    setCategoriaDados(result);
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

    async function salvarDados(event) {
        try {
            setExibirSpinnerCarregando(true);

            debugger;
            var response = null;

            let nomeAlterado = document.getElementById("nomeCategoria").value;

            if (nomeAlterado === '') {
                alert("Nome da categoria é obrigatório.");
            } else {
                let jbToken = sessionStorage.getItem("jbToken");

                var payLoad = {
                    Id: (tipoAcao === "Alterar" ? document.getElementById("idCategoria").value : -1),
                    Nome: nomeAlterado
                }
                if (tipoAcao === "Alterar") {
                    response = await fetch("https://localhost:44397/api/Categoria", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "bearer " + jbToken
                        },
                        body: JSON.stringify(payLoad)
                    });
                } else {
                    response = await fetch("https://localhost:44397/api/Categoria", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "bearer " + jbToken
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
                        window.location.reload();
                    }
                } else if (response.status === 401) {
                    sessionStorage.removeItem("jbToken");
                    alert("Necessário realizar novamente o login.");

                    window.location.reload();
                } else {
                    const result = await response.json();

                    alert(result.Message);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setExibirSpinnerCarregando(false);
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
                exibirSpinnerCarregando ? (
                    <SpinnerCarregando msgAuxiliar={''} />
                ) : (

                    (categoriaNaoEncontrada === true && tipoAcao === "Alterar") ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Categorias na base."} /> : (
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
                )
            }
        </>
    )
}