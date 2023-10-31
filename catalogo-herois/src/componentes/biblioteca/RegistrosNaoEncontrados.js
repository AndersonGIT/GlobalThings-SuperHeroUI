export default function RegistrosNaoEncontrados(props) {
    const { tipoRegistro } = props;
    return (
        <>
            <div>
                {
                    tipoRegistro !== '' ? <span>{tipoRegistro}</span> : <span>Sem registros na base.</span>
                }
            </div>
        </>
    )
}