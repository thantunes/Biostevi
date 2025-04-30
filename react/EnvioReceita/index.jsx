import React, { useEffect, useState } from 'react'
import FirebaseConfig from './FirebaseConfig';
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useProduct } from 'vtex.product-context'
import './index.global.css'

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
    const [ PostVisible, setPostVisible] =  useState('none') 
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
                    console.log('Dentro do Up',url)
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
                'Nome': Nome,
                'Telefone': Tel,
                'NomeProduto': product.productName
            }
        };

        if (DOCURL != '' && DOCURL != undefined) {
            fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(() => {
                setDocURL('')
                setFile('Enviado!')
                setEnviado(true)
            })
            .catch((error) => {
                console.error('Erro ao enviar email:', error)
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

                )
            }
        } else {
            setReceita(children)
        }
    }, [Trigger, Enviado])
    return (
        <div class='FormContainer'>
            <img src="https://stevia.vtexassets.com/assets/vtex.file-manager-graphql/images/70963de3-4d2f-4d5e-85b9-57627f6d491d___25fb1d2abe6e31202519b997774cc7e9.png" alt="Banner" />
            <form className='FormProduct' action="">
                <label htmlFor="NameProduct">
                    <input required type="text" placeholder='Nome' onChange={e => setNome(e.target.value)} name="NameProduct" id="NameProduct" />
                </label>
                <label htmlFor="TellProduct">
                    <input required type="text" placeholder='Telefone:' onChange={e => setTel(e.target.value)} data-mask="(00) 0000-0000" name="TellProduct" id="TellProduct" />
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label className='ReceitaInput' htmlFor="ReceitaInput">
                        {file}
                        <input required={true} id='ReceitaInput' onChange={e => {
                            setArchive(e.target.files[0])
                            setFile('Arquivo anexado')
                            setPostVisible('flex')
                        }} type={'file'} />
                    </label>
                    <button style={{display: `${PostVisible}`}} className='SubmitButton' onClick={(e) => {
                        e.preventDefault();
                        const  Input  = document.getElementById('ReceitaInput')
                        console.log(Input)
                        if (Input.files[0] != undefined){
                            OnSave(e)
                        } else {
                            alert('Anexe sua receita para enviar !')
                        }
                    }} >Enviar formulário</button>
                </div>
            </form>
        </div>
    )
}

export { EnvioReceita }