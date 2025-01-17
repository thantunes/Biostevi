import React, { useMemo, useEffect } from 'react';
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';
import { useRuntime } from 'vtex.render-runtime';

const SequencePagination = () => {
    const { searchQuery, maxItemsPerPage, page } = useSearchPage();
    const { query, route } = useRuntime();
    const [currentPage, setCurrentPage] = React.useState('');
    const [searchParams, setSearchParams] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    async function getFunctionURLS() {
        try {
            const urlCurrentPage = await new URL(window.location.href);
            const urlSearchParam = await new URLSearchParams(urlCurrentPage.search);

            setCurrentPage(urlCurrentPage);
            setSearchParams(urlSearchParam);
        } catch (error) {
            console.log('deu erro po')
        } finally { 
            setLoading(false);
            console.log("currentPage")
            console.log(currentPage)
            console.log("searchParams")
            console.log(searchParams)
        }
    }

    useEffect(() => {
        getFunctionURLS()
    }, []);

    const windowSize = 3; // Número de páginas antes e depois da página atual para exibir
    const totalPages = useMemo(() => Math.ceil(searchQuery.recordsFiltered / maxItemsPerPage), [searchQuery.recordsFiltered, maxItemsPerPage]);

    function createHref(pageNumberParam) {
        // searchParams.delete("page");

        // if (pageNumberParam !== 1) searchParams.set("page", pageNumberParam);

        // return `${currentPage.pathname}?${searchParams.toString()}`;
        return null;
    }

    const createPageLink = (pageNumber, isCurrent = false) => {
        if(loading) {return null} {

        }
        if (isCurrent) {
            return (
                <div key={pageNumber} className="current bg-main text-white">
                    <span className="px-2 py-2">{pageNumber}</span>
                </div>
            );
        }
        return (
            <div key={pageNumber} className="page-item">
                <a className="px-2 py-2" href={createHref(pageNumber)}>
                    {pageNumber}
                </a>
            </div>
        );
    };

    const renderPages = useMemo(() => {
        const pages = [];
        let start = Math.max(1, page - windowSize);
        let end = Math.min(totalPages, page + windowSize);

        if (start > 1) {
            pages.push(createPageLink(1));
            if (start > 2) pages.push(<div key="start-dots">...</div>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(createPageLink(i, i === page));
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push(<div key="end-dots">...</div>);
            pages.push(createPageLink(totalPages));
        }

        return pages;
    }, [page, totalPages, windowSize]);

    return (
        <>
        {loading ? <span>Loading...</span> : <div style={{ display: "flex", flexDirection: "row", gap: "10px" }} className="pagination flex gap-2">{renderPages}</div> }
        </>
    )
    
    // return (
    //     <div style={{ display: "flex", flexDirection: "row", gap: "10px" }} className="pagination flex gap-2">
    //         {renderPages}
    //     </div>
    // );
};

export default SequencePagination;


