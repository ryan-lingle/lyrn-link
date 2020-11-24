import React, { useEffect, useContext } from 'react';
import { Form } from '../components';
import Context from '../context';

const Scraper = () => {
    const { api, state } = useContext(Context);

    function scrape({ target }) {
        api.scrape(target.value);
    };

    function onSubmit(params) {
        api.createItem(state.list.type, params);
    };

    const loading = state.loading.scrape;
    const error = state.errors.scrape;
    const result = state.scrapeResult;

    return(
        <div>
            <img src={result.image} width="300px" />
            <Form
                onSubmit={onSubmit}
                submitCopy="Create Item"
                type="items"
                inputs={[
                    {
                        label: 'Url',
                        key: 'url',
                        type: 'text',
                        onChange: scrape
                    },
                    {
                        label: 'Title',
                        key: 'title',
                        type: 'text',
                        defaultValue: result.title,
                    },
                    {
                        label: 'Description',
                        key: 'description',
                        type: 'textarea',
                        defaultValue: result.description,
                    },
                    {
                        type: 'hidden',
                        key: 'image',
                        defaultValue: result.image,
                    }
                ]}
            />
        </div>
    );
}

export default Scraper;