import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'
import Form from 'react-bootstrap/Form';
import SpinnerCarregando from '../biblioteca/SpinnerCarregando.js'

export default function HeroiFormulario(props) {
    const { idHeroi, tipoAcao } = props;
    const [heroiDados, setHeroiDados] = useState({});
    const [heroiNaoEncontrado, setHeroiNaoEncontrado] = useState(false);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaDeCategoriasVazia, setListaDeCategoriasVazia] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(-1);
    const [exibirSpinnerCarregando, setExibirSpinnerCarregando] = useState(false);

    async function consultarHeroi() {
        try {
            setExibirSpinnerCarregando(true);

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
                    setHeroiDados(result);
                }
            } else if (response.status === 404) {
                setHeroiNaoEncontrado(true);
            } else if (response.status === 401) {
                sessionStorage.removeItem("jbToken");
                alert("Necessário realizar novamente o login.");

                window.location.reload();
            } else {
                const result = await response.json();

                alert(result.Message);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setExibirSpinnerCarregando(false);
        }
    }

    async function listarCategorias() {
        try {
            setExibirSpinnerCarregando(true);

            let jbToken = sessionStorage.getItem("jbToken");

            const response = await fetch("https://localhost:44397/api/Categoria", {
                method: "GET",
                headers: {
                    "Authorization": "bearer " + jbToken
                }
            });

            if (response.ok) {
                const result = await response.json();
                setListaCategorias(result);
            } else if (response.status === 404) {
                setListaDeCategoriasVazia(true);
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

            let jbToken = sessionStorage.getItem("jbToken");

            var response = null;

            let nomeAlterado = document.getElementById("nomeHeroi").value;

            if (categoriaSelecionada === -1) {
                alert("É obrigatório a escolha de uma categoria.");
            }
            else {
                var payLoad = {
                    Id: (tipoAcao === "Alterar" ? document.getElementById("idHeroi").value : -1),
                    Nome: nomeAlterado === '' ? heroiDados.Nome : nomeAlterado,
                    IdCategoria: categoriaSelecionada
                }
                if (tipoAcao === "Alterar") {
                    response = await fetch("https://localhost:44397/api/Heroi", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "bearer " + jbToken
                        },
                        body: JSON.stringify(payLoad)
                    });
                } else {
                    response = await fetch("https://localhost:44397/api/Heroi", {
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

    async function selectionarCategoria(event) {
        try {
            var categoriaSelec = event.target.value;
            setCategoriaSelecionada(categoriaSelec);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        return () => {
            listarCategorias();
            if (tipoAcao === "Alterar")
                consultarHeroi();
        }
    }, []);
    return (
        <>
            {
                exibirSpinnerCarregando ? (
                    <SpinnerCarregando msgAuxiliar={''} />
                ) : (

                    listaDeCategoriasVazia ? <span>É necessário registrar pelomenos uma categoria para inserir novos heróis.</span> :
                        (
                            heroiNaoEncontrado === true && tipoAcao === "Alterar") ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Herói na base."} /> : (
                            <div className="row">
                                {
                                    <div>
                                        {
                                            tipoAcao === "Alterar" ?
                                                (
                                                    <div>
                                                        <p className=""><strong>Id: </strong> <input type="text" id="idHeroi" value={tipoAcao === "Alterar" ? heroiDados.Id : ''} /> </p>
                                                        <label className="">Nome atual do Herói:</label>
                                                        <strong>{heroiDados.Nome}</strong>
                                                    </div>
                                                ) : null
                                        }
                                        <label>{tipoAcao === "Alterar" ? 'Novo Nome:' : 'Nome Herói:'}</label>
                                        <input type="text" id="nomeHeroi" />
                                        <Form.Select aria-label="Selecionar Categoria" id="categoriaSelect" onChange={(event) => selectionarCategoria(event)}>
                                            <option value={-1} >Selecione uma categoria...</option>))
                                            {
                                                listaCategorias.map((categoriaItem, categoriaIndex) => (
                                                    <option key={categoriaIndex} value={categoriaItem.Id} >{categoriaItem.Nome}</option>))
                                            }
                                            ))
                                        </Form.Select>
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