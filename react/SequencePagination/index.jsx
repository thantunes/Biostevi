import React, { useMemo } from 'react';
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';
import { useRuntime } from 'vtex.render-runtime';
import "./index.global.css"

function shouldNotIncludeMap(map) {
    if (
        !map ||
        map === 'b' ||
        map === 'brand' ||
        map === 'c' ||
        map === 'category-1' ||
        map === 'department'
    ) {
        return true
    }

    const mapTree = map.split(',')

    if (mapTree.length > 3) {
        return false
    }

    return mapTree.every(mapItem => mapItem === 'c')
}

export function getMapQueryString(searchQuery, hideMap) {
    if (
        hideMap ||
        !searchQuery ||
        !searchQuery.variables ||
        shouldNotIncludeMap(searchQuery.variables.map)
    ) {
        return ''
    }

    return `map=${searchQuery.variables.map}`
}

export function getPriceRange(query) {
    if (!query.priceRange) return ''

    return `priceRange=${query.priceRange}`
}

export function getWorkspace(query) {
    if (!query.workspace) return ''

    return `workspace=${query.workspace}`
}

const SequencePagination = () => {
    const { searchQuery, maxItemsPerPage, page } = useSearchPage();
    const { query } = useRuntime()
    const hideMap = !query?.map

    const windowSize = 3; 

    // A VTEX limita a 50 páginas, então não é necessário calcular mais que isso. Caso corrigir, é necessário retornar o código abaixo.
    // const totalPages = useMemo(() => Math.ceil(searchQuery.recordsFiltered / maxItemsPerPage), [searchQuery.recordsFiltered, maxItemsPerPage]);

    const totalPages = useMemo(() => {
        const calculatedPages = Math.ceil(searchQuery.recordsFiltered / maxItemsPerPage);
        return calculatedPages > 50 ? 50 : calculatedPages;
    }, [searchQuery.recordsFiltered, maxItemsPerPage]);

    function createHref(pageNumberParam) {
        const pageParam = pageNumberParam === 1 ? '' : `page=${pageNumberParam}`

        const queryString = [getMapQueryString(searchQuery, hideMap), getPriceRange(query), pageParam, getWorkspace(query)]
            .filter(Boolean)
            .join('&')

        return `${queryString ? `?${queryString}` : '' }`
    }

    const createPageLink = (pageNumber, isCurrent = false) => {
        if (isCurrent) {
            return (
                <div key={pageNumber} className="page-item">
                    <span className="page-current">{pageNumber}</span>
                </div>
            );
        }
        return (
            <div key={pageNumber} className="page-item">
                <a className="page-link" href={createHref(pageNumber)}>
                    {pageNumber}
                </a>
            </div>
        );
    };

    const renderPages = useMemo(() => {
        if (totalPages === 1) return null;

        const pages = [];
        let start = Math.max(1, page - windowSize);
        let end = Math.min(totalPages, page + windowSize);

        if (start > 1) {
            pages.push(createPageLink(1));
            if (start > 2) pages.push(<div key="start-dots" className="dots">...</div>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(createPageLink(i, i === page));
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push(<div key="end-dots" className="dots">...</div>);
            pages.push(createPageLink(totalPages));
        }

        return pages;
    }, [page, totalPages, windowSize]);

    return (
        <div className="containerPagination">
            {renderPages}
        </div>
    );
};

export default SequencePagination;


