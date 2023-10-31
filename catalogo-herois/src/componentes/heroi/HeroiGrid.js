import { useEffect, useState } from "react";
import RegistrosNaoEncontrados from '../biblioteca/RegistrosNaoEncontrados.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import HeroiDetalhes from '../heroi/HeroiDetalhes.js'
import HeroiFormulario from '../heroi/HeroiFormulario.js'

export default function HeroiGrid(props) {
    const [listaHerois, setListaHerois] = useState([]);
    const [listaDeHeroisVazia, setListaDeHeroisVazia] = useState(false);
    const [idHeroiSelecionado, setIdHeroiSelecionado] = useState(-1);
    const [show, setShow] = useState(false);
    const [showFormulario, setShowFormulario] = useState(false);
    const [tpAcao, setTpAcao] = useState('');

    const handleClose = (modalForm) => {
        if (modalForm) {
            setShowFormulario(!showFormulario);
        } else {
            setShow(false);
            setIdHeroiSelecionado(-1);
        }
    }

    const handleShow = (modalForm) => {
        if (modalForm) {
            setShowFormulario(!showFormulario);
        } else {
            setShow(true);
        }
    }

    async function listarHerois() {
        try {
            const response = await fetch("https://localhost:44397/api/Heroi", {
                method: "GET",
            });
            
            if (response.ok) {
                const result = await response.json();

                if (result) {
                    setListaHerois(result);
                }
            } else if (response.status === 404) {
                setListaDeHeroisVazia(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function abrirDetalhesHeroi(event) {
        try {

            let idSelecionado = event.target.value;

            if (idSelecionado > 0) {
                setIdHeroiSelecionado(idSelecionado);
                handleShow(false);
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function removerHeroi(event) {
        try {
            debugger;
            let idSelecionado = event.target.value;

            if (idSelecionado > 0) {
                const response = await fetch("https://localhost:44397/api/Heroi?idHeroi=" + idSelecionado, {
                    method: "DELETE"
                });

                if (response.ok) {
                    listarHerois();
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }        
    }

    async function alterarHeroi(event) {
        try {
            debugger;
            let idSelecionado = event.target.value;

            if (idSelecionado > 0) {
                setIdHeroiSelecionado(idSelecionado);
                setTpAcao("Alterar");
                handleShow(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function inserirHeroi(event) {
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
            listarHerois();
        }
    }, []);    

    return (
        <>
            <div className="row">
                <button className="btnCadastrarHeroi" onClick={(event) => inserirHeroi(event)}>Inserir Herói</button>
            </div>
            {
                listaDeHeroisVazia === true ? <RegistrosNaoEncontrados tipoRegistro={"Sem registros de Herois na base."} /> : (
                    <div className="row">
                        <div>
                            <h2>Lista de Heróis</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Nome Herói</th>
                                        <th scope="col"></th>
                                        <th scope="col"></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listaHerois.map((heroiItem, heroiIndex) => (
                                            <tr key={heroiIndex}>
                                                <td className="">{heroiItem.Id}</td>
                                                <td className="">{heroiItem.Nome}</td>
                                                <td className=""><button className="btnAbrirDetalhesHeroi btn-primary" value={heroiItem.Id} onClick={(event) => abrirDetalhesHeroi(event)}>Abrir Detalhes</button></td>
                                                <td className=""><button className="btnAlterarHeroi btn-danger" value={heroiItem.Id} onClick={(event) => alterarHeroi(event)}>Alterar</button></td>
                                                <td className=""><button className="btnRemoverHeroi btn-danger" value={heroiItem.Id} onClick={(event) => removerHeroi(event)}>Excluir</button></td>
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
                    <Modal.Title>Detalhes do Herói</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HeroiDetalhes idHeroi={idHeroiSelecionado} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleClose(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showFormulario} onHide={() => handleClose(true)}>
                <Modal.Header closeButton>
                    <Modal.Title>Herói</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HeroiFormulario idHeroi={idHeroiSelecionado} tipoAcao={tpAcao} />
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