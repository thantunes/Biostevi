import React, { useEffect, useState } from 'react'
import FirebaseConfig from './FirebaseConfig';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useProduct } from 'vtex.product-context'
import './index.global.css'
import $ from 'jquery'
const EnvioReceita = ({ children }) => {



    // const storage = getStorage(FirebaseApp);
    const [Nome, setNome] = useState('')
    const [Tel, setTel] = useState('')
    const [Archive, setArchive] = useState('')

    const [Receita, setReceita] = useState()
    const { product } = useProduct()
    console.log(product)
    const app = initializeApp(FirebaseConfig);
    const storage = getStorage(app);
    console.log(app)
    const [file, setFile] = useState('Anexar receita')
    const [DOCURL, setDocURL] = useState()
    const [Trigger, setTrigger] = useState(false)
    const [Enviado, setEnviado] = useState(false)

    useEffect(() => {
        setTrigger(!Trigger)
    }, [])
    function OnSave(e) {
        e.preventDefault();
        setFile('Enviando')
        const UpTask = ref(storage, `Receitas/${Archive.name}`)
        const Up = uploadBytesResumable(UpTask, Archive)
        console.log('file', Archive)
        Up.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
            error => {
                alert(`houve um erro ao enviar o arquivo: ${error.code}`)
            },
            () => {
                getDownloadURL(Up.snapshot.ref).then(url => {
                    setDocURL(url)
                })
            }

        )
    }
    useEffect(() => {
        console.log(DOCURL)
        const Params = {
            'Link-Receita': DOCURL,
        }
        var data = {
            service_id: 'service_ngrrbic',
            template_id: 'template_g5qqq0l',
            user_id: 'HhXbUVRq4M8ocYz_D',
            template_params: {
                'Link-Receita': DOCURL,
                'Nome':Nome,
                'Telefone':Tel,
                'NomeProduto':product.productName
            }
        };

        console.log(Params)
        if (DOCURL != '' && DOCURL != undefined) {
            console.log($)
            console.log(DOCURL)
            $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function () {
                setDocURL('')
                setFile('Enviado!')
                setEnviado(true)
            }).fail(function (error) {
            })
        }
    }, [DOCURL])
    useEffect(() => {
        console.log("Escopo Maior")
        const receita = product.properties.find(e => e.name == "Tipo de Receita")
        console.log(receita?.values?.[0])

        if (receita?.values?.[0] == 'Médico') {
            console.log("Escopo Baixo")
            if (Enviado) {
                console.log("Escopo Sub-Sim")

                setReceita(
                    <>
                        
                        <p style={{ fontWeight: 'bold' }}>Compra liberada</p>
                        {children}
                        <p style={{ fontWeight: 'bold' }}>Receita Enviada !</p>
                    </>
                )
            } else {
                console.log("Escopo Sub-Não")
                setReceita(
                    <>
                        <p style={{ fontWeight: 'bold' }}>Envie sua receita para que a compra do item seja liberada.</p>
                        <form className='FormProduct' action="">
                            <label htmlFor="NameProduct">
                                Nome:
                                <input required type="text" onChange={e => setNome(e.target.value)} name="NameProduct" id="NameProduct" />
                            </label>
                            <label htmlFor="TellProduct">
                                Telefone:
                                <input required type="text" onChange={e => setTel(e.target.value)} data-mask="(00) 0000-0000" name="TellProduct" id="TellProduct" />
                            </label>
                            <div style={{display:'flex', flexDirection:'row',gap: '25px'}}>
                                <label className='ReceitaInput' htmlFor="ReceitaInput">
                                    {file}
                                    <input required id='ReceitaInput' onChange={e => setArchive(e.target.files[0])} type={'file'}/>
                                </label>
                                <button className='SubmitButton' onClick={(e) => OnSave(e)} >Enviar formulário</button>
                            </div>
                        </form>
                    </>
                )
            }
        } else {
            setReceita(children)
        }
    }, [Trigger, Enviado])
    return (
        <>
            {Receita}
        </>
    )
}

export { EnvioReceita }