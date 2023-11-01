import Spinner from 'react-bootstrap/Spinner';

export default function SpinnerCarregando(props) {
    const { mensagemAuxiliar } = props;
    return (
        <>
            <Spinner animation="border" role="status" className="text-center">
                <span className={(mensagemAuxiliar && mensagemAuxiliar !== '') ? '' : 'visually-hidden'} >{(mensagemAuxiliar && mensagemAuxiliar !== '') ? mensagemAuxiliar : 'Carregando...'}</span>
            </Spinner>
        </>
    )
}