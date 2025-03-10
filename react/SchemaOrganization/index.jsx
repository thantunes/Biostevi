import React from 'react'

const SchemaOrganization = ({
    name,
    alternateName,
    url,
    logo,
    sameAs,
    sameAs1,
    sameAs2,
    sameAs3,
    sameAs4,
    sameAs5,
    sameAs6,
    address = {},
    email,
    telephone,
}) => {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        url,
        sameAs: [sameAs1, sameAs2, sameAs3, sameAs4, sameAs5, sameAs6].filter(Boolean),
        logo,
        name,
        alternateName,
        email,
        telephone,
        address: address ? {
            '@type': 'PostalAddress',
            ...address,
        } : undefined,
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
        />
    )
}

SchemaOrganization.schema = {
    title: 'Schema Organization',
    description: 'Inserir dados para Rich Snippet de Organization',
    type: 'object',
    properties: {
        name: {
            title: 'name',
            description: '',
            type: 'string',
            isRequired: true,
        },
        alternateName: {
            title: 'alternateName',
            description: '',
            type: 'string'
        },
        url: {
            title: 'url',
            description: '',
            type: 'string',
            isRequired: true,
        },
        logo: {
            title: 'logo',
            description: '',
            type: 'string'
        },
        sameAs1: {
            title: "sameAs1",
            description: "",
            type: "string"
        },
        sameAs2: {
            title: "sameAs2",
            description: "",
            type: "string"
        },
        sameAs3: {
            title: "sameAs3",
            description: "",
            type: "string"
        },
        sameAs4: {
            title: "sameAs4",
            description: "",
            type: "string"
        },
        sameAs5: {
            title: "sameAs5",
            description: "",
            type: "string"
        },
        sameAs6: {
            title: "sameAs6",
            description: "",
            type: "string"
        },
        address: {
            title: 'address',
            description: '',
            type: 'object',
            properties: {
                streetAddress: {
                    title: 'streetAddress',
                    description: '',
                    type: 'string'
                },
                addressLocality: {
                    title: 'addressLocality',
                    description: '',
                    type: 'string'
                },
                addressRegion: {
                    title: 'addressRegion',
                    description: '',
                    type: 'string'
                },
                addressCountry: {
                    title: 'addressCountry',
                    description: '',
                    type: 'string'
                },
                postalCode: {
                    title: 'postalCode',
                    description: '',
                    type: 'string'
                },
            },
        },
        email: {
            title: 'email',
            description: '',
            type: 'string'
        },
        telephone: {
            title: 'telephone',
            description: '',
            type: 'string'
        },
    },
}

export default SchemaOrganization

