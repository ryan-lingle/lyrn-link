import React, { useEffect, useContext } from 'react';
import { ErrorBox, Loader, ListTab, NewList, Search, Scraper, ItemCard } from '../components';
import Context from '../context';

const AdminList = ({ match }) => {
    const { api, state } = useContext(Context);

    useEffect(() => {
        api.getList(match.params);
    }, []);

    const loading = state.loading.lists;
    const error = state.errors.lists;

    if (loading) return <Loader />;
    if (error) return <ErrorBox error={error} />;

    const type = state.list.type;

    return(
        <div id="dashboard">
            <br/>
            <div className="card-wrapper new-list">
                {state.user.lists.map((list, i) =>
                    <ListTab {...list} key={i} />
                )}
                <NewList />
            </div>
            <h1>{type && type.toUpperCase()}</h1>
            <br/>
            {
                state.list.searchable

                ?   <Search {...state.list} >
                        {(result, clearResults) =>
                            <div className="search-result" onClick={() => {
                                api.createItem(type, result);
                                clearResults();
                            }} >
                                <img src={result.image} width="70px" />
                                <div>{result.title}</div>
                            </div>
                        }
                    </Search>

                :   <Scraper />
            }
            {state.list.items.map((item, i) => <ItemCard key={i} {...item} />)}
        </div>
    );
}

export default AdminList;