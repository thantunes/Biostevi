import React, { useMemo, useEffect, useState } from 'react';
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';
import { useRuntime } from 'vtex.render-runtime';
import "./index.global.css"

const SequencePagination = () => {
    const { searchQuery, maxItemsPerPage, page } = useSearchPage();
    const { route } = useRuntime();
    const [path, setPath] = useState(''); // adicionei essa linha para garantir que o path seja setado apenas quando estiver disponível

    useEffect(() => {
        if (route.canonicalPath) setPath(route.canonicalPath);
    }, [route]); // utilizei o useEffect para setar o path apenas quando ele estiver disponível

    const windowSize = 4; // Número de páginas antes e depois da página atual para exibir
    const totalPages = useMemo(() => Math.ceil(searchQuery.recordsFiltered / maxItemsPerPage), [searchQuery.recordsFiltered, maxItemsPerPage]);

    function createHref(pageNumberParam) {
        const searchParams = new URLSearchParams(route.path.split('?')[1]);
        searchParams.forEach((value, key) => {
            if (key === 'map' && value === 'c') searchParams.delete(key);
        });

        if (searchParams.has("initialMap")) searchParams.delete("initialMap");
        if (searchParams.has("initialQuery")) searchParams.delete("initialQuery");

        if (searchParams.has("page")) searchParams.delete("page");
        if (pageNumberParam !== 1) searchParams.set("page", pageNumberParam);

        return `${path}${searchParams.toString() ? '?' : ''}${searchParams.toString()}`;
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
    }, [page, totalPages, windowSize, path]); // adicionei o path como dependência do useMemo

    return (
        <div className="containerPagination">
            {renderPages}
        </div>
    );
};

export default SequencePagination;



