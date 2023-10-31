import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CategoriaDetalhes from '../categoria/CategoriaDetalhes.js'
import CategoriaFormulario from "./CategoriaFormulario.js";

export default function CategoriaGrid(props) {
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaDeCategoriasVazia, setListaDeCategoriasVazia] = useState(false);
    const [idCategoriaSelecionada, setIdCategoriaSelecionada] = useState(-1);
    const [show, setShow] = useState(false);
    const [showFormulario, setShowFormulario] = useState(false);
    const [tpAcao, setTpAcao] = useState('');

    const handleClose = (modalForm) => {
        if (modalForm) {
            setShowFormulario(!showFormulario);
        } else {
            setShow(false);
            setIdCategoriaSelecionada(-1);
        }
    }

    const handleShow = (modalForm) => {
        if (modalForm) {
            setShowFormulario(!showFormulario);
        } else {
            setShow(true);
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

    async function abrirDetalhesCategoria(event) {
        try {

            let idSelecionado = event.target.value;

            if (idSelecionado > 0) {
                setIdCategoriaSelecionada(idSelecionado);
                handleShow(false);
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function removerCategoria(event) {
        try {
            debugger;
            let idSelecionado = event.target.value;

            if (idSelecionado > 0) {
                const response = await fetch("https://localhost:44397/api/Categoria?idCategoria=" + idSelecionado, {
                    method: "DELETE"
                });

                if (response.ok) {
                    listarCategorias();
                } else {
                    const result = await response.json();
                    alert(result.Message);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function alterarCategoria(event) {
        try {
            debugger;
            let idSelecionado = event.target.value;

            if (idSelecionado > 0) {
                setIdCategoriaSelecionada(idSelecionado);
                setTpAcao("Alterar");
                handleShow(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function inserirCategoria(event) {
        try {
            setTpAcao("Inserir");
            handleShow(true);
        }
        catch (error) {
        console.error("Error:", error);
    }
}

useEffect(() => {
    return () => {
        listarCategorias();
    }
}, []);

return (
    <>
        <div className="row">
            <button className="btnCadastrarCategoria" onClick={(event) => inserirCategoria(event) }>Inserir Categoria</button>
        </div>
        {
            listaDeCategoriasVazia === true ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Categorias na base."} /> : (
                <div className="row">
                    <div>
                        <h2>Lista de Categorias</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Nome Categoria</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listaCategorias.map((categoriaItem, categoriaIndex) => (
                                        <tr key={categoriaIndex}>
                                            <td className="">{categoriaItem.Id}</td>
                                            <td className="">{categoriaItem.Nome}</td>
                                            <td className=""><button className="btnAbrirDetalhesCategoria" value={categoriaItem.Id} onClick={(event) => abrirDetalhesCategoria(event)}>Abrir Detalhes</button></td>
                                            <td className=""><button className="btnAlterarCategoria btn-danger" value={categoriaItem.Id} onClick={(event) => alterarCategoria(event)}>Alterar</button></td>
                                            <td className=""><button className="btnRemoverCategoria btn-danger" value={categoriaItem.Id} onClick={(event) => removerCategoria(event)}>Excluir</button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }

        <Modal show={show} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Detalhes da Categoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CategoriaDetalhes idCategoria={idCategoriaSelecionada} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => handleClose(false)}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showFormulario} onHide={() => handleClose(true)}>
            <Modal.Header closeButton>
                <Modal.Title>Categoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CategoriaFormulario idCategoria={idCategoriaSelecionada} tipoAcao={tpAcao} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => handleClose(true)}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
)
}