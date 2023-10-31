import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'
import Form from 'react-bootstrap/Form';

export default function HeroiFormulario(props) {
    const { idHeroi, tipoAcao } = props;
    const [heroiDados, setHeroiDados] = useState({});
    const [heroiNaoEncontrado, setHeroiNaoEncontrado] = useState(false);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaDeCategoriasVazia, setListaDeCategoriasVazia] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(-1);

    async function consultarHeroi() {
        try {
            const response = await fetch("https://localhost:44397/api/Heroi?idHeroi=" + idHeroi, {
                method: "GET",
            });
            if (response.ok) {
                const result = await response.json();

                if (result) {
                    setHeroiDados(result);
                }
            } else if (response.status === 404) {
                setHeroiNaoEncontrado(true);
            } else {
                const result = await response.json();

                alert(result.Message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function listarCategorias() {
        try {
            debugger;
            const response = await fetch("https://localhost:44397/api/Categoria", {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.json();
                setListaCategorias(result);
            } else if (response.status === 404) {
                setListaDeCategoriasVazia(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function salvarDados(event) {
        try {
            debugger;
            var response = null;

            let nomeAlterado = document.getElementById("nomeHeroi").value;

            if (categoriaSelecionada === -1) {
                alert("� obrigat�rio a escolha de uma categoria.");
            }
            else if (nomeAlterado === '') {
                alert("Nome do her�i � obrigat�rio.");
            } else {
                var payLoad = {
                    Id: (tipoAcao === "Alterar" ? document.getElementById("idHeroi").value : -1),
                    Nome: nomeAlterado,
                    IdCategoria: categoriaSelecionada
                }
                if (tipoAcao === "Alterar") {
                    response = await fetch("https://localhost:44397/api/Heroi", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payLoad)
                    });
                } else {
                    response = await fetch("https://localhost:44397/api/Heroi", {
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
                listaDeCategoriasVazia ? <span>� necess�rio registrar pelomenos uma categoria para inserir novos her�is.</span> :
                    (
                        heroiNaoEncontrado === true && tipoAcao === "Alterar") ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Her�i na base."} /> : (
                        <div className="row">
                            {
                                <div>
                                    {
                                        tipoAcao === "Alterar" ?
                                            (
                                                <div>
                                                    <p className=""><strong>Id: </strong> <input type="text" id="idHeroi" value={tipoAcao === "Alterar" ? heroiDados.Id : ''} /> </p>
                                                    <label className="">Nome atual do Her�i:</label>
                                                    <strong>{heroiDados.Nome}</strong>
                                                </div>
                                            ) : null
                                    }
                                    <label>{tipoAcao === "Alterar" ? 'Novo Nome:' : 'Nome Her�i:'}</label>
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
            }
        </>
    )
}